<?php
// +----------------------------------------------------------------------
// | 订单资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class Order extends Base
{
    private $locker = null;

    function __construct()
    {
        // 文件锁，解决并发问题
        // 在服务端解决并发问题后建议使用并行结构
        $this->locker = fopen(__DIR__ . '/../../runtime/shopping_cart.lock', 'w+');
    }

    /**
     * 生成订单号
     */
    private function generateOrderNumber ()
    {
        $time = explode (' ', microtime());
        $time = $time[1] . ($time[0] * 1000);
        $time = explode ('.', $time)[0];
        return $time . rand(10000, 99999);
    }

    /**
     * 获取查询对象
     */
    private function getQuery($user_id)
    {
        if (empty($user_id)) {
            abort(400, '必须提供用户ID');
        }

        $fields = 'o.order_id as id, o.order_number as order_number, o.order_price as total_price, o.trade_no as trade_no, o.pay_status as pay_status, o.consignee_addr as express_address, e.express_com as express_company, e.express_nu as express_number, o.is_send as send_status, o.user_id as user_id';

        return model('Order')::alias('o')
            ->leftJoin('Express e', 'o.order_id = e.order_id')
            ->where('o.user_id', $user_id)
            ->field($fields);
    }

    /**
     * 获取订单商品
     */
    private function getOrderProducts($order_id)
    {
        return model('OrderGoods')::alias('og')
            ->join('Goods g', 'og.goods_id = g.goods_id')
            ->where('og.order_id', $order_id)
            ->field('g.goods_id as id, g.goods_name as name, g.goods_small_logo as thumbnail, g.goods_big_logo as picture, g.goods_price as price, og.goods_number as amount')
            ->select();
    }

    /**
     * 获取用户的全部订单记录
     *
     * GET /users/:id/order
     *
     * params
     * - id: 用户ID
     */
    public function index($id)
    {
        $user_id = intval($id);

        $orders = $this->getQuery($user_id)->select();

        foreach ($orders as $item) {
            $item->pay_status = $item->pay_status === '1' ? '已付款' : '未付款';
            $item->send_status = $item->send_status === '是' ? '已发货' : '未发货';
            $item->products = $this->getOrderProducts($item->id);
            $item->total_amount = 0;
            foreach ($item->products as $p) {
                $item->total_amount += $p->amount;
            }
        }

        return json($orders);
    }

    /**
     * 获取用户的单个订单记录
     *
     * GET /users/:id/order/:order_num
     *
     * params
     * - id: 用户ID
     * - order_num: 订单编号
     */
    public function read($id, $order_num)
    {
        $user_id = intval($id);

        if (empty($order_num)) {
            abort(400, '必须提供订单编号');
        }

        $order = $this->getQuery($user_id)->where('o.order_number', $order_num)->find();

        if (empty($order)) {
            abort(404, '未找到对应订单信息');
        }

        $order->pay_status = $order->pay_status === '1' ? '已付款' : '未付款';
        $order->send_status = $order->send_status === '是' ? '已发货' : '未发货';

        $order->products = $this->getOrderProducts($order->id);

        $order->total_amount = 0;
        foreach ($order->products as $p) {
            $order->total_amount += $p->amount;
        }

        return json($order);
    }

    /**
     * 添加用户订单记录
     *
     * POST /users/:id/order
     *
     * params
     * - id: 用户ID
     *
     * body
     * - items: 待添加到订单的商品ID数组
     */
    public function save($id)
    {
        $user_id = intval($id);

        if (empty($user_id)) {
            abort(400, '必须提供用户ID');
        }

        // 待添加到订单的商品ID数组 => [ '<id>' ]
        $items = explode(',', input('post.items/s'));


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
                if (in_array($item->id, $items)) {
                    $wants[] = $item;
                } else {
                    $remain[] = $item;
                }
            }

            if (count($wants) !== count($items)) {
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
     * 更新用户单条订单记录
     *
     * PATCH /users/:id/order/:order_num
     *
     * params
     * - id: 用户ID
     * - order_num: 订单编号
     *
     * body
     * - pay_status: 支付状态，支持 0: 未支付 / 1: 已支付
     * - send_status: 发货状态，支持 0: 未发货 / 1: 已发货
     * - express_address: 收货地址，格式：<name> <address> <phone> <code>
     */
    public function update($id, $order_num)
    {
        $user_id = intval($id);

        if (empty($order_num)) {
            abort(400, '必须提供订单编号');
        }

        $pay_status = input('patch.pay_status/b');
        $send_status = input('patch.send_status/b');
        $express_address = input('patch.express_address/s');

        if (!isset($pay_status) && !isset($send_status) && !isset($express_address)) {
            abort(422, '必须提供一个以上的修改字段');
        }

        // 查询当前数据
        $order = model('Order')::where('user_id', $user_id)->where('order_number', $order_num)->find();

        if (empty($order)) {
            abort(404, '此订单记录不存在');
        }

        if (isset($pay_status)) {
            $order->pay_status = intval($pay_status);
        }

        if (isset($send_status)) {
            $order->is_send = $send_status ? '是' : '否';
        }

        if (isset($express_address)) {
            $order->consignee_addr = $express_address;
        }

        $order->save();

        return $this->read($user_id, $order_num);
    }

    /**
     * 删除用户单条订单记录
     *
     * DELETE /users/:id/order/:order_num
     *
     * params
     * - id: 用户ID
     * - order_num: 订单编号
     */
    public function delete($id, $order_num)
    {
        $user_id = intval($id);

        if (empty($user_id)) {
            abort(400, '必须提供用户ID');
        }

        if (empty($order_num)) {
            abort(400, '必须提供订单编号');
        }

        $order = model('Order')::where('user_id', $user_id)->where('order_number', $order_num)->find();

        if (empty($order)) {
            abort(404, '此订单记录不存在');
        }

        model('OrderGoods')::where('order_id', $order->order_id)->delete();

        $order->delete();

        abort(204);
    }
}
