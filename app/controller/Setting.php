<?php
// +----------------------------------------------------------------------
// | 设置资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class Setting extends Base
{
    private $settings = [
        'site_title' => '品优购 - 品质、优选、安心购！',
        'site_description' => '品优购 - 品质、优选、安心购！',
        'site_keywords' => '品优购, 品质, 优选, 安心购',
        'site_footer' => '<p>地址：北京市昌平区建材城西路金燕龙办公楼一层 邮编：100096 电话：400-618-4000 传真：010-82935100</p><p>京ICP备08001421号京公网安备110108007702</p>',
        'home_slides' => [
            [ 'title' => '人气好书榜', 'image' => '/static/banner1.jpg', 'link' => 'http://localhost:2080/sale/1' ],
            [ 'title' => '低至一元秒杀', 'image' => '/static/banner2.jpg', 'link' => 'http://localhost:2080/sale/2' ],
            [ 'title' => '爆款5折', 'image' => '/static/banner3.jpg', 'link' => 'http://localhost:2080/sale/3' ],
            [ 'title' => '办公好货优先抢', 'image' => '/static/banner4.jpg', 'link' => 'http://localhost:2080/sale/4' ]
        ],
        'search_hotwords' => [
            '品优购首发', '亿元优惠', '9.9元团购', '每满99减30', '亿元优惠', '9.9元团购', '办公用品'
        ],
        'login_poster' => '/static/login-poster.png'
    ];

    function __construct()
    {
        $origin = get_current_origin();
        foreach ($this->settings['home_slides'] as &$item) {
            $item['image'] = $origin . $item['image'];
        }

        $this->settings['login_poster'] = $origin . $this->settings['login_poster'];
    }

    /**
     * 显示资源列表
     *
     * @return \think\Response
     */
    public function index()
    {
        return json($this->settings);
    }

    /**
     * 显示指定的资源
     *
     * @param  int  $id
     * @return \think\Response
     */
    public function read($key)
    {
        if (empty($key)) {
            abort(400, 'Bad Request');
        }

        if (!isset($this->settings[$key])) {
            abort(404, 'Not Found');
        }

        return json($this->settings[$key]);
    }
}
