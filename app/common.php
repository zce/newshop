<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: zce <w@zce.me>
// +----------------------------------------------------------------------

// +----------------------------------------------------------------------
// | 应用公共函数文件
// +----------------------------------------------------------------------

function starts_with ($needle, $haystack) {
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

function ends_with ($needle, $haystack) {
    $length = strlen($needle);
    return $length === 0 || (substr($haystack, -$length) === $needle);
}

/**
 * 获取当前根地址
 * @return string 根地址
 */
function get_current_origin () {
    $origin = 'http';
    $origin .= $_SERVER['SERVER_PORT'] == '443' ? 's' : '';
    $origin .= '://' . $_SERVER['SERVER_NAME'];
    $origin .= $_SERVER['SERVER_PORT'] !== '80' ? ':' . $_SERVER['SERVER_PORT'] : '';
    return $origin;
}

/**
 * 获取当前页面完整 URL 地址
 * @return string 完整 URL 地址
 */
function get_current_url () {
    $protocal = isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == '443' ? 'https://' : 'http://';
    $php_self = $_SERVER['PHP_SELF'] ? $_SERVER['PHP_SELF'] : $_SERVER['SCRIPT_NAME'];
    $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $relate_url = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : $php_self . (isset($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : $path_info);
    return $protocal . (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') . $relate_url;
}

/**
 * 获取请求参数中的分页参数
 * @param  integer $default_limit 默认限制数量
 * @param  integer $max_limit     最大限制数量
 * @return array                  分页参数
 */
function get_pagination_params ($default_limit = 20, $max_limit = 50) {
    $page = input('get.page/d') ?: 1;

    $limit = input('get.limit/d') ?: input('get.per_page/d') ?: $default_limit;
    $limit = $limit > $max_limit ? $max_limit : $limit;

    $offset = input('get.offset/d') ?: ($page - 1) * $limit;
    $page = $offset / $limit + 1;

    $sort_mapping = [
        'commend' => 'goods_id desc',
        'quantity' => 'hot_mumber desc',
        'market_time' => 'upd_time desc',
        'price' => 'goods_price desc',
        '-price' => 'goods_price asc',
    ];
    $sort = isset($sort_mapping[input('get.sort/s') ?: 'commend'])
        ? $sort_mapping[input('get.sort/s') ?: 'commend']
        : 'goods_id desc';

    return [ 'limit' => $limit, 'page' => $page, 'offset' => $offset, 'sort' => $sort ];
}

/**
 * 获取筛选参数
 * @return array 筛选参数
 */
function get_filter_params () {
    $temp = explode(',', input('get.filter/s'));
    $filter = [];
    foreach ($temp as $item) {
        $kv = explode(':', $item);
        if (!empty($kv[0]) && !empty($kv[1])) {
            $filter[$kv[0]] = $kv[1];
        }
    }
    return $filter;
}

/**
 * 判断请求参数中是否为包括某种资源的请求
 * @param  string  $name 资源名
 * @return boolean       是否包含
 */
function is_include ($name) {
    $includes = explode(',', input('get.include/s'));
    return in_array($name, $includes);
}

/**
 * 获取基于当前 URL 的分页页码地址
 * @param  integer $page 页码
 * @return string        URL 地址
 */
function get_pagination_url ($page) {
    $querystring = input('get.');
    $querystring['page'] = $page;
    return get_current_origin() . $_SERVER['PHP_SELF'] . '?' . http_build_query($querystring);
}

/**
 * 获取分页信息响应头
 * @param  array $pagination 分页信息
 * @return array                响应头信息数组
 */
function get_pagination_header ($pagination) {
    $header['X-Total-Count'] = $pagination['total_count'];
    $header['X-Total-Pages'] = ceil($pagination['total_count'] / $pagination['limit']);
    $header['X-Limit-Count'] = $pagination['limit'];
    $header['X-Current-Page'] = $pagination['page'];

    if ($pagination['page'] !== 1) {
        $links[] = '<' . get_pagination_url(1) . '>; rel=first';
    }
    if ($pagination['page'] > 1) {
        $links[] = '<' . get_pagination_url($pagination['page'] - 1) . '>; rel=prev';
    }
    if ($pagination['page'] < $header['X-Total-Pages']) {
        $links[] = '<' . get_pagination_url($pagination['page'] + 1) . '>; rel=next';
    }
    if ($pagination['page'] !== $header['X-Total-Pages']) {
        $links[] = '<' . get_pagination_url($header['X-Total-Pages']) . '>; rel=last';
    }
    $header['Link'] = join(', ', $links);

    return $header;
}
