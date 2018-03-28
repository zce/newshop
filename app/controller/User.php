<?php
// +----------------------------------------------------------------------
// | 用户资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class User extends Base
{
    private $fields = 'user_id as id, username as username, password as password, user_email as email, user_email_code as email_verify, is_active as actived, user_sex as gender, user_qq as qq, user_tel as phone, user_hobby as hobby, user_introduce as introduce, qq_open_id as open_id';

    /**
     * 获取单个用户信息对象
     *
     * GET /users/:id
     *
     * params
     * - id: 用户ID
     */
    public function read($id)
    {
        $id = intval($id);

        if (empty($id)) {
            // abort(400, 'Bad Request');
            abort(400, '必须提供用户ID');
        }

        $user = model('User')::where('user_id', $id)->field($this->fields)->find();

        if (empty($user)) {
            abort(404, '此用户不存在');
        }

        $user->actived = $user->actived === '是';

        return json($user);
    }

    /**
     * 更新单个用户信息
     *
     * PATCH /users/:id
     *
     * params
     * - id: 用户ID
     *
     * body
     * - email: 邮箱
     * - password: 密码
     * - gender: 性别
     * - qq: QQ
     * - phone: 手机
     * - hobby: 兴趣爱好
     * - introduce: 个人简介
     * - open_id: 开放登录ID
     */
    public function update($id)
    {
        $id = intval($id);

        if (empty($id)) {
            // abort(400, 'Bad Request');
            abort(400, '必须提供用户ID');
        }

        $email = input('patch.email/s');
        $password = input('patch.password/s');
        $gender = input('patch.gender/s');
        $qq = input('patch.qq/s');
        $phone = input('patch.phone/s');
        $hobby = input('patch.hobby/s');
        $introduce = input('patch.introduce/s');
        $open_id = input('patch.open_id/s');

        if (empty($email) && empty($password) && empty($gender) && empty($qq) && empty($phone) && empty($hobby) && empty($introduce)&& empty($open_id)) {
            abort(422, '必须提供一个以上的修改字段');
        }

        $user = model('User')::get($id);

        if (empty($user)) {
            abort(404, '此用户不存在');
        }

        if (!empty($email) && $email !== $user->user_email) {
            if (model('User')::where('user_email', $email)->count()) {
                // abort(422, 'Unprocesable Entity');
                abort(422, '邮箱已存在');
            }
            $user->user_email = $email;
        }

        if (!empty($password)) {
            $user->password = password_hash($password, PASSWORD_DEFAULT);
        }

        if (!empty($gender)) {
            $user->user_sex = in_array($gender, ['保密', '女', '男']) ? $gender : '保密';
        }

        if (!empty($qq)) {
            $user->user_qq = $qq;
        }

        if (!empty($phone)) {
            $user->user_tel = $phone;
        }

        if (!empty($hobby)) {
            $user->user_hobby = $hobby;
        }

        if (!empty($introduce)) {
            $user->user_introduce = $introduce;
        }

        if (!empty($open_id)) {
            $user->qq_open_id = $open_id;
        }

        $user->update_time = time();

        $user->save();

        return $this->read($id);
    }

    /**
     * 删除单个用户信息对象
     *
     * DELETE /users/:id
     *
     * params
     * - id: 用户ID
     */
    public function delete($id)
    {
        $id = intval($id);

        if (empty($id)) {
            // abort(400, 'Bad Request');
            abort(400, '必须提供用户ID');
        }

        $user = model('User')::get($id);

        if (empty($user)) {
            abort(404, '此用户不存在');
        }

        model('UserCart')::where('user_id', $id)->delete();
        model('Consignee')::where('user_id', $id)->delete();

        $user->delete();

        abort(204);
    }

    /**
     * 用户登录
     *
     * POST /users/login
     *
     * params
     * - username: 用户名或邮箱
     * - password: 密码（明文）
     */
    public function login()
    {
        $username = input('post.username/s');
        $password = input('post.password/s');

        if (empty($username) || empty($password)) {
            // abort(400, 'Bad Request');
            abort(422, '必须提供用户名和密码');
        }

        $user = model('User')
            ::whereOr('username', $username)
            ->whereOr('user_email', $username)
            ->field($this->fields)
            ->find();

        if (empty($user)) {
            abort(422, '用户名错误');
        }

        if (!password_verify($password, $user->password)) {
            // abort(401, 'Unauthorized');
            abort(422, '密码错误');
        }

        $user->actived = $user->actived === '是';

        return json($user);
    }

    /**
     * 用户注册
     *
     * POST /users/register
     *
     * body
     * - username: 用户名
     * - email: 邮箱
     * - password: 密码
     */
    public function register()
    {
        $username = input('post.username/s');
        $email = input('post.email/s');
        $password = input('post.password/s');

        if (empty($username) || empty($email) || empty($password)) {
            // abort(400, 'Bad Request');
            abort(422, '必须提供用户名、邮箱和密码');
        }

        if (model('User')::where('username', $username)->count()) {
            // abort(422, 'Unprocesable Entity');
            abort(422, '用户名已存在');
        }

        if (model('User')::where('user_email', $email)->count()) {
            // abort(422, 'Unprocesable Entity');
            abort(422, '邮箱已存在');
        }

        $password = password_hash($password, PASSWORD_DEFAULT);

        $user = model('User')::create([
            'username' => $username,
            'user_email' => $email,
            'password' => $password,
            'user_email_code' => uniqid(),
            'create_time' => time(),
            'update_time' => time()
        ]);

        if (empty($user) || empty($user->user_id)) {
            // abort(500, 'Internal Server Error');
            abort(500, '注册用户失败');
        }

        return $this->read($user->user_id);
    }

    /**
     * 获取用户名或邮箱的存在情况
     *
     * GET /users/exists
     *
     * query
     * - username: 用户名（可选）
     * - email: 邮箱（可选）
     */
    public function exists()
    {
        $username = input('get.username/s');
        $email = input('get.email/s');

        if (!empty($username)) {
            $result['username'] = !!model('User')::where('username', $username)->count();
        }

        if (!empty($email)) {
            $result['email'] = !!model('User')::where('user_email', $email)->count();
        }

        if (empty($result)) {
            // abort(400, 'Bad Request');
            abort(400, '必须提供用户名或邮箱');
        }

        return json($result);
    }

    /**
     * 激活单个用户
     *
     * POST /users/:id/active
     *
     * params
     * - id: 用户ID
     */
    public function active($id)
    {
        $id = intval($id);

        if (empty($id)) {
            abort(400, '必须提供用户ID');
        }

        $user = model('User')::get($id);

        if (empty($user)) {
            abort(404, '此用户不存在');
        }

        $user->user_email_code = null;
        $user->is_active = '是';
        $user->update_time = time();

        $user->save();

        return $this->read($id);
    }

    /**
     * 取消激活单个用户
     *
     * DELETE /users/:id/active
     *
     * params
     * - id: 用户ID
     */
    public function unactive($id)
    {
        $id = intval($id);

        if (empty($id)) {
            // abort(400, 'Bad Request');
            abort(400, '必须提供用户ID');
        }

        $user = model('User')::get($id);

        if (empty($user)) {
            abort(404, '此用户不存在');
        }

        $user->user_email_code = uniqid();
        $user->is_active = '否';
        $user->update_time = time();

        $user->save();

        return $this->read($id);
    }
}
