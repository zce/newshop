<?php
// +----------------------------------------------------------------------
// | 订单资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class Order extends Base
{
    private $locker = null;

    function __construct() {
        // 文件锁，解决并发问题
        // 在服务端解决并发问题后建议使用并行结构
        $this->locker = fopen(__DIR__ . '/../../runtime/shopping_cart.lock', 'w+');
    }

    /**
     * 生成订单号
     */
    function generateOrderNumber () {
        $time = explode (' ', microtime());
        $time = $time[1] . ($time[0] * 1000);
        $time = explode ('.', $time)[0];
        return $time . rand(10000, 99999);
    }

    private function getQuery($user_id)
    {
        $fields = 'o.order_id as id, o.order_number as order_number, o.order_price as total_price, o.trade_no as trade_no, o.pay_status as pay_status, o.consignee_addr as express_address, e.express_com as express_company, e.express_nu as express_number, o.is_send as send_status, o.user_id as user_id';
        return model('Order')::alias('o')
            ->leftJoin('Express e', 'o.order_id = e.order_id')
            ->where('o.user_id', $user_id)
            ->field($fields);
    }

    private function getOrderProducts($order_id)
    {
        return model('OrderGoods')::alias('og')
            ->join('Goods g', 'og.goods_id = g.goods_id')
            ->where('og.order_id', $order_id)
            ->field('g.goods_id as id, g.goods_name as name, g.goods_small_logo as thumbnail, g.goods_big_logo as picture, g.goods_price as price, og.goods_number as amount')
            ->select();
    }

    /**
     * 显示资源列表
     */
    public function index($id)
    {
        $user_id = intval($id);

        if (empty($user_id)) {
            abort(400, '必须提供用户ID');
        }

        $records = $this->getQuery($user_id)->select();

        foreach ($records as $item) {
            $item->pay_status = $item->pay_status === '1' ? '已付款' : '未付款';
            $item->send_status = $item->send_status === '是' ? '已发货' : '未发货';
            $item->products = $this->getOrderProducts($item->id);
        }

        return json($records);
    }

    /**
     * 保存新建的资源
     */
    public function save($id)
    {
        $user_id = intval($id);

        if (empty($user_id)) {
            abort(400, '必须提供用户ID');
        }

        // 待添加到订单的商品ID数组 => [ '<id>' ]
        $ids = explode(',', input('post.id/s'));


        if (flock($this->locker, LOCK_EX)) {
            // 获取用户购物车记录
            $cart = model('UserCart')::where('user_id', $user_id)->find();
            if (empty($cart)) {
                abort('422', '购物车记录不匹配');
            }
            $cart_info = json_decode($cart->cart_info) ?: [];
            if (empty($cart_info)) {
                abort('422', '购物车记录不匹配');
            }

            // 从购物车记录中找到对应结算商品
            $remain = []; // 购物车剩下
            $wants = []; // 当前结算
            foreach ($cart_info as $item) {
                if (in_array($item->id, $ids)) {
                    $wants[] = $item;
                } else {
                    $remain[] = $item;
                }
            }

            if (count($wants) !== count($ids)) {
                abort(422, '购物车记录不匹配');
            }

            // 计算总价格
            $total_price = 0;
            foreach ($wants as $item) {
                $item->price = model('Goods')::where('goods_id', $item->id)->value('goods_price');
                $item->total = $item->price * $item->amount;
                $total_price += $item->total;
            }

            // 默认收货地址
            $address = model('Consignee')::where('user_id', $user_id)->value('cgn_address') ?: '';

            // 创建订单
            $order = model('Order')::create([
                'user_id' => $user_id,
                'order_number' => $this->generateOrderNumber(),
                'order_price' => $total_price,
                'consignee_addr' => $address,
                'create_time' => time(),
                'update_time' => time()
            ]);

            // 创建订单商品
            foreach ($wants as $item) {
                model('OrderGoods')::create([
                    'order_id' => $order->order_id,
                    'goods_id' => $item->id,
                    'goods_price' => $item->price,
                    'goods_number' => $item->amount,
                    'goods_total_price' => $item->total
                ]);
            }

            // 保存剩余购物车记录
            $cart->cart_info = json_encode($remain);

            $cart->save();

            flock($this->locker, LOCK_UN);
        }


        return $this->read($user_id, $order->order_number);
    }

    /**
     * 显示指定的资源
     */
    public function read($id, $number)
    {
        $user_id = intval($id);

        if (empty($user_id) || empty($number)) {
            abort(400, '必须提供用户ID和订单编号');
        }

        $order = $this->getQuery($user_id)->where('o.order_number', $number)->find();

        if (empty($order)) {
            abort(404, '未找到对应订单信息');
        }

        $order->pay_status = $order->pay_status === '1' ? '已付款' : '未付款';
        $order->send_status = $order->send_status === '是' ? '已发货' : '未发货';

        $order->products = $this->getOrderProducts($order->id);

        return json($order);
    }

    /**
     * 显示编辑资源表单页
     */
    public function edit($id, $number)
    {
        $user_id = intval($id);

        if (empty($user_id) || empty($number)) {
            abort(400, '必须提供用户ID和订单编号');
        }
    }

    /**
     * 保存更新的资源
     */
    public function update($id, $number)
    {
        $user_id = intval($id);

        if (empty($user_id) || empty($number)) {
            abort(400, '必须提供用户ID和订单编号');
        }
    }

    /**
     * 删除指定资源
     */
    public function delete($id, $number)
    {
        $user_id = intval($id);

        if (empty($user_id) || empty($number)) {
            abort(400, '必须提供用户ID和订单编号');
        }
    }
}
