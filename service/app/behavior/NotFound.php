<?php

namespace app\behavior;

class NotFound
{
    public function run($response)
    {
        if (empty($response->getData())) {
            abort(404, 'NotFound');
        }
    }
}
