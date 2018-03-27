<?php
// +----------------------------------------------------------------------
// | 购物车资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class Cart extends Base
{
    private $locker = null;

    function __construct() {
        // 文件锁，解决并发问题
        // 在服务端解决并发问题后建议使用并行结构
        $this->locker = fopen(__DIR__ . '/../../runtime/shopping_cart.lock', 'w+');
    }

    private function getCart($id)
    {
        $id = intval($id);

        if (empty($id)) {
            abort(400, '必须提供用户ID');
        }

        $cart = model('UserCart')::where('user_id', $id)->find();

        if (empty($cart)) {
            $cart = model('UserCart')::create([
                'user_id' =>  $id,
                'cart_info' => '[]',
                'created_at' => time(),
                'updated_at' => time()
            ]);
        }

        return $cart;
    }

    /**
     * 显示资源列表
     *
     * @param  int  $id  用户ID
     * @return \think\Response
     */
    public function index($id)
    {
        if (flock($this->locker, LOCK_EX)) {
            $cart_info = $this->getCart($id)->cart_info;

            if (empty($cart_info)) return json();

            $cart = json_decode($cart_info) ?: [];

            foreach ($cart as $item) {
                $product = model('Goods')::get($item->id);
                $item->name = $product->goods_name;
                $item->thumbnail = $product->goods_small_logo;
                $item->price = $product->goods_price;
                $item->total = number_format($product->goods_price * $item->amount, 2, '.', '');
            }

            flock($this->locker, LOCK_UN);
        }

        return json($cart);
    }

    /**
     * 保存新建的资源
     *
     * @param  int  $id  用户ID
     * @return \think\Response
     */
    public function save($id)
    {
        $cart_id = input('post.id/d');
        $amount = input('post.amount/d');

        if (empty($cart_id) || empty($amount)) {
            abort(422, '必须提供商品ID和数量');
        }

        if (model('Goods')::where('goods_id', $cart_id)->count() === 0) {
            abort(422, '商品ID不存在');
        }

        if (flock($this->locker, LOCK_EX)) {
            $cart = $this->getCart($id);

            $cart_info = json_decode($cart->cart_info) ?: [];

            foreach ($cart_info as $item) {
                if ($item->id === $cart_id) {
                    $exists = $item;
                }
            }

            if (isset($exists)) {
                $exists->amount += $amount;
            } else {
                $cart_info[] = [
                    'id' => $cart_id,
                    'amount' => $amount
                ];
            }

            $cart->cart_info = json_encode($cart_info);

            $cart->save();

            flock($this->locker, LOCK_UN);
        }

        return $this->index($id);
    }

    /**
     * 保存更新的资源
     *
     * @param  int  $id  用户ID
     * @param  int  $cart_id  购物车商品ID
     * @return \think\Response
     */
    public function update($id, $cart_id)
    {
        $cart_id = intval($cart_id);

        if (empty($cart_id)) {
            abort(400, '必须提供商品ID');
        }

        $amount = input('patch.amount/d');

        if (empty($amount)) {
            abort(422, '必须提供商品数量');
        }

        if (flock($this->locker, LOCK_EX)) {
            $cart = $this->getCart($id);

            $cart_info = json_decode($cart->cart_info) ?: [];

            foreach ($cart_info as $item) {
                if ($item->id === $cart_id) {
                    $item->amount = $amount;
                }
            }

            $cart->cart_info = json_encode($cart_info);

            $cart->save();

            flock($this->locker, LOCK_UN);
        }

        return $this->index($id);
    }

    /**
     * 删除指定资源
     *
     * @param  int  $id  用户ID
     * @param  int  $cart_id  购物车商品ID
     * @return \think\Response
     */
    public function delete($id, $cart_id)
    {
        $cart_id = intval($cart_id);

        if (empty($cart_id)) {
            abort(400, '必须提供商品ID');
        }

        if (flock($this->locker, LOCK_EX)) {
            $cart = $this->getCart($id);

            $cart_info = json_decode($cart->cart_info) ?: [];

            $remain = [];
            foreach ($cart_info as $key => $item) {
                if ($item->id !== $cart_id) {
                    $remain[] = $item;
                }
            }

            $cart->cart_info = json_encode($remain);

            $cart->save();

            flock($this->locker, LOCK_UN);
        }

        return $this->index($id);
    }
}
