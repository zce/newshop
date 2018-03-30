<?php
// +----------------------------------------------------------------------
// | 示例资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class Index extends Base
{
    private function api($path)
    {
        return get_current_origin() . $path;
    }

    /**
     * 索引
     *
     * GET /
     */
    public function index()
    {
        return json([
            'settings_url' => $this->api('/settings'),
            'categories_url' => $this->api('/categories'),
            'products_url' => $this->api('/products'),
            'users_url' => $this->api('/users'),
            'orders_url' => $this->api('/orders')
        ]);
    }
}
