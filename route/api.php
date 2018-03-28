<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: zce <w@zce.me>
// +----------------------------------------------------------------------

// +----------------------------------------------------------------------
// | API 路由规则
// +----------------------------------------------------------------------

Route::group('api/v1', function () {
    // settings
    Route::get('settings/:key', 'Setting/read');
    Route::get('settings', 'Setting/index');

    // categories
    Route::get('categories/:id/products', 'Product/category');
    Route::get('categories/:id/children', 'Category/children');
    Route::get('categories/:id', 'Category/read');
    Route::get('categories', 'Category/index');

    // products
    Route::get('products/:id', 'Product/read');
    Route::get('products', 'Product/index');

    // users
    Route::post('users/login', 'User/login');
    Route::post('users/register', 'User/register');
    Route::get('users/exists', 'User/exists');

    Route::post('users/:id/active', 'User/active');
    Route::delete('users/:id/active', 'User/unactive');

    Route::delete('users/:id/address/:address_id', 'Address/delete');
    Route::patch('users/:id/address/:address_id', 'Address/update');
    Route::get('users/:id/address/:address_id', 'Address/read');
    Route::post('users/:id/address', 'Address/save');
    Route::get('users/:id/address', 'Address/index');

    Route::delete('users/:id/cart/:cart_id', 'Cart/delete');
    Route::patch('users/:id/cart/:cart_id', 'Cart/update');
    Route::post('users/:id/cart', 'Cart/save');
    Route::get('users/:id/cart', 'Cart/index');

    Route::delete('users/:id/order/:number', 'Order/delete');
    Route::patch('users/:id/order/:number', 'Order/update');
    Route::get('users/:id/order/:number', 'Order/read');
    Route::post('users/:id/order', 'Order/save');
    Route::get('users/:id/order', 'Order/index');

    Route::get('users/:id', 'User/read');
    Route::patch('users/:id', 'User/update');
    Route::delete('users/:id', 'User/delete');
});
