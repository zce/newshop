<?php
// +----------------------------------------------------------------------
// | 购物车资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class Cart extends Base
{
    private $locker = null;

    function __construct()
    {
        // 文件锁，解决并发问题
        // 在服务端解决并发问题后建议使用并行结构
        $this->locker = fopen(__DIR__ . '/../../runtime/shopping_cart.lock', 'w+');
    }

    private function getCart($user_id)
    {
        if (empty($user_id)) {
            abort(400, '必须提供用户ID');
        }

        $cart = model('UserCart')::where('user_id', $user_id)->find();

        if (empty($cart)) {
            $cart = model('UserCart')::create([
                'user_id' =>  $user_id,
                'cart_info' => '[]',
                'created_at' => time(),
                'updated_at' => time()
            ]);
        }

        return $cart;
    }

    /**
     * 获取用户的全部购物车记录
     *
     * GET /users/:id/cart
     *
     * params
     * - id: 用户ID
     */
    public function index($id)
    {
        $user_id = intval($id);

        if (flock($this->locker, LOCK_EX)) {
            $cart_info = $this->getCart($user_id)->cart_info;

            flock($this->locker, LOCK_UN);
        }

        if (empty($cart_info)) return json();

        $cart = json_decode($cart_info) ?: [];

        foreach ($cart as $item) {
            $product = model('Goods')::get($item->id);
            $item->name = $product->goods_name;
            $item->thumbnail = $product->goods_small_logo;
            $item->price = $product->goods_price;
            $item->total = number_format($product->goods_price * $item->amount, 2, '.', '');
        }

        return json($cart);
    }

    /**
     * 添加用户购物车记录
     *
     * POST /users/:id/cart
     *
     * params
     * - id: 用户ID
     *
     * body
     * - id: 商品ID
     * - amount: 商品数量
     */
    public function save($id)
    {
        $user_id = intval($id);

        $product_id = input('post.id/d');
        $amount = input('post.amount/d');

        if (empty($product_id) || empty($amount)) {
            abort(422, '必须提供商品ID和数量');
        }

        if (model('Goods')::where('goods_id', $product_id)->count() === 0) {
            abort(422, '商品ID不存在');
        }

        if (flock($this->locker, LOCK_EX)) {
            // 获取当前购物车记录
            $cart = $this->getCart($user_id);
            $cart_info = json_decode($cart->cart_info) ?: [];

            // 尝试查找是否已有该商品
            foreach ($cart_info as $item) {
                if ($item->id === $product_id) {
                    $exists = $item;
                }
            }

            // 添加
            if (isset($exists)) {
                $exists->amount += $amount;
            } else {
                $cart_info[] = [
                    'id' => $product_id,
                    'amount' => $amount
                ];
            }

            // 保存
            $cart->cart_info = json_encode($cart_info);
            $cart->save();

            flock($this->locker, LOCK_UN);
        }

        return $this->index($user_id);
    }

    /**
     * 更新用户单条购物车记录
     *
     * PATCH /users/:id/cart/:cart_id
     *
     * params
     * - id: 用户ID
     * - cart_id: 购物车商品ID
     *
     * body
     * - amount: 更新后的商品数量
     */
    public function update($id, $cart_id)
    {
        $user_id = intval($id);
        $product_id = intval($cart_id);

        if (empty($product_id)) {
            abort(400, '必须提供商品ID');
        }

        $amount = input('patch.amount/d');

        if (empty($amount)) {
            abort(422, '必须提供商品数量');
        }

        if (flock($this->locker, LOCK_EX)) {
            $cart = $this->getCart($user_id);
            $cart_info = json_decode($cart->cart_info) ?: [];

            foreach ($cart_info as $item) {
                if ($item->id === $product_id) {
                    $item->amount = $amount;
                }
            }

            $cart->cart_info = json_encode($cart_info);
            $cart->save();

            flock($this->locker, LOCK_UN);
        }

        return $this->index($user_id);
    }

    /**
     * 删除用户单条购物车记录
     *
     * DELETE /users/:id/cart/:cart_id
     *
     * params
     * - id: 用户ID
     * - cart_id: 购物车商品ID
     */
    public function delete($id, $cart_id)
    {
        $user_id = intval($id);
        $product_id = intval($cart_id);

        if (empty($product_id)) {
            abort(400, '必须提供商品ID');
        }

        if (flock($this->locker, LOCK_EX)) {
            $cart = $this->getCart($user_id);

            $cart_info = json_decode($cart->cart_info) ?: [];

            $remain = [];
            foreach ($cart_info as $key => $item) {
                if ($item->id !== $product_id) {
                    $remain[] = $item;
                }
            }

            $cart->cart_info = json_encode($remain);

            $cart->save();

            flock($this->locker, LOCK_UN);
        }

        return $this->index($user_id);
    }
}
