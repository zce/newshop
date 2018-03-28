<?php
// +----------------------------------------------------------------------
// | 地址资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class Address extends Base
{
    private function getQuery($user_id)
    {
        if (empty($user_id)) {
            abort(400, '必须提供用户ID');
        }
        return model('Consignee')::where('user_id', $user_id)->where('delete_time', null);
    }

    /**
     * 获取用户全部收货地址
     *
     * GET /user/:id/address
     *
     * param
     * - id: 用户ID
     */
    public function index($id)
    {
        $user_id = intval($id);

        $records = $this->getQuery($user_id)
            ->field('cgn_id as id, cgn_name as name, cgn_address as address, cgn_tel as phone, cgn_code as code')
            ->select();

        return json($records);
    }

    /**
     * 获取用户单个收货地址
     *
     * GET /user/:id/address/:address_id
     *
     * param
     * - id: 用户ID
     * - address_id: 收货地址ID
     */
    public function read($id, $address_id)
    {
        $user_id = intval($id);
        $address_id = intval($address_id);

        if (empty($address_id)) {
            abort(400, '必须提供收货地址ID');
        }

        $record = $this->getQuery($user_id)->where('cgn_id', $address_id)
            ->field('cgn_id as id, cgn_name as name, cgn_address as address, cgn_tel as phone, cgn_code as code')
            ->find();

        if (empty($record)) {
            abort(404, '此收货地址记录不存在');
        }

        return json($record);
    }

    /**
     * 添加用户收货地址
     *
     * POST /user/:id/address
     *
     * param
     * - id: 用户ID
     *
     * body
     * - name: 收货人姓名
     * - address: 收货人地址
     * - phone: 收货人手机
     * - code: 收货人邮编
     */
    public function save($id)
    {
        $user_id = intval($id);

        if (empty($user_id)) {
            abort(400, '必须提供用户ID');
        }

        $name = input('post.name/s');
        $address = input('post.address/s');
        $phone = input('post.phone/s');
        $code = input('post.code/s');

        if (empty($name) || empty($address) || empty($phone) || empty($code)) {
            abort(422, '必须提供收货人姓名、地址、手机和邮编');
        }

        $record = model('Consignee')::create([
            'user_id' => $user_id,
            'cgn_name' => $name,
            'cgn_address' => $address,
            'cgn_tel' => $phone,
            'cgn_code' => $code,
        ]);

        if (empty($record) || empty($record->cgn_id)) {
            abort(500, '添加收货地址失败');
        }

        return $this->read($user_id, $record->cgn_id);
    }

    /**
     * 更新用户收货地址
     *
     * PATCH /user/:id/address/:address_id
     *
     * param
     * - id: 用户ID
     * - address_id: 收货地址ID
     *
     * body
     * - name: 收货人姓名（可选）
     * - address: 收货人地址（可选）
     * - phone: 收货人手机（可选）
     * - code: 收货人邮编（可选）
     */
    public function update($id, $address_id)
    {
        $user_id = intval($id);
        $address_id = intval($address_id);

        if (empty($address_id)) {
            abort(400, '必须提供收货地址ID');
        }

        $name = input('patch.name/s');
        $address = input('patch.address/s');
        $phone = input('patch.phone/s');
        $code = input('patch.code/s');

        if (empty($name) && empty($address) && empty($phone) && empty($code)) {
            abort(422, '必须提供一个以上的修改字段');
        }

        $record = $this->getQuery($user_id)->where('cgn_id', $address_id)->find();

        if (empty($record)) {
            abort(404, '此收货地址记录不存在');
        }

        if (!empty($name)) {
            $record->cgn_name = $name;
        }

        if (!empty($address)) {
            $record->cgn_address = $address;
        }

        if (!empty($phone)) {
            $record->cgn_tel = $phone;
        }

        if (!empty($code)) {
            $record->cgn_code = $code;
        }

        $record->save();

        return $this->read($user_id, $record->cgn_id);
    }

    /**
     * 删除单个用户收货地址
     *
     * DELETE /user/:id/address/:address_id
     *
     * param
     * - id: 用户ID
     * - address_id: 收货地址ID
     */
    public function delete($id, $address_id)
    {
        $user_id = intval($id);
        $address_id = intval($address_id);

        if (empty($address_id)) {
            abort(400, '必须提供收货地址ID');
        }

        $record = $this->getQuery($user_id)->where('cgn_id', $address_id)->find();

        if (empty($record)) {
            abort(404, '此收货地址记录不存在');
        }

        $record->delete_time = time();

        $record->save();

        abort(204);
    }
}
