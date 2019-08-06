<?php

namespace app\exception;

use Exception;
use think\exception\Handle;
use think\exception\HttpException;

class Http extends Handle
{
    private $statusTexts = [
        400 => 'Bad Request',
        401 => 'Unauthorized',
        403 => 'Token Invalid',
        404 => 'Not Found',
        422 => 'Unprocesable Entity',
        500 => 'Internal Server Error'
    ];

    public function render(Exception $e)
    {
        // if (config('app.app_debug')) {
        //     return parent::render($e);
        // }

        // 请求异常
        if ($e instanceof HttpException) {
            $code = $e->getStatusCode();
        }

        $code = isset($code) ? $code : 500;

        $error = isset($this->statusTexts[$code]) ? $this->statusTexts[$code] : 'Error';

        $message = $e->getMessage();

        // if (starts_with('controller not exists:', $message) || starts_with('module not exists:', $message)) {
        //     $message = 'Not Found';
        // }

        $result = [ 'error'  => $error, 'message'  => $message ];

        return json($result, $code);
    }
}
