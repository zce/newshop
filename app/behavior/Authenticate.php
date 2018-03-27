<?php

namespace app\behavior;

use think\Request;

class Authenticate
{
    public function run(Request $request)
    {
        // 行为逻辑
        $key = $request->server('PHP_AUTH_USER');
        $secret = $request->server('PHP_AUTH_PW');

        if (config('client.' . $key) === $secret) {
            return true;
        }

        abort(401, 'Unauthorized', ['WWW-Authenticate' => 'Basic realm="Unauthorized"']);
    }
}
