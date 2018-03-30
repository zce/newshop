<?php
// +----------------------------------------------------------------------
// | 分类资源控制器
// +----------------------------------------------------------------------

namespace app\controller;

class Category extends Base
{
    private $categories = null;

    function __construct()
    {
        $this->categories = model('Category')::where('cat_deleted', 0)
            // ->field([ 'cat_id' => 'id', 'cat_name' => 'name', 'cat_pid' => 'pid', 'cat_level' => 'level' ])
            ->field('cat_id as id, cat_name as name, cat_pid as pid, cat_level as level')
            ->select();
    }

    /**
     * 获取指定分类 ID 的子分类
     * @param  integer $id 分类ID
     * @return array       子分类数组
     */
    private function getCategoryChildren($id)
    {
        // TODO caching
        $children = [];
        foreach ($this->categories as $key=>$item) {
            if ($item->pid !== $id) continue;

            $subchildren = $this->getCategoryChildren($item->id);
            if (isset($subchildren)) {
                $item->children = $subchildren;
            }
            $children[] = $item;
            unset($this->categories[$key]);
        }
        return $children;
    }

    /**
     * 获取全部分类列表
     *
     * GET /categories
     *
     * query
     * - format: 输出格式，支持：tree（树状结构）（可选）
     */
    public function index()
    {
        $format = input('get.format/s');

        if ($format !== 'tree') return json($this->categories);

        return json($this->getCategoryChildren(0));
    }

    /**
     * 获取指定分类对象
     *
     * GET /categories/:id
     *
     * query
     * - include: 包含额外资源，支持：parent, children（可选）
     */
    public function read($id)
    {
        $id = intval($id);

        if (empty($id)) {
            // abort(400, 'Bad Request');
            abort(400, '必须提供分类ID');
        }

        $query = model('Category')::alias('current');
        $fields = 'current.cat_id as id, current.cat_name as name, current.cat_pid as pid, current.cat_level as level';

        if (is_include('parent')) {
            $query
                ->leftJoin('Category parent', 'current.cat_pid = parent.cat_id')
                ->leftJoin('Category root', 'parent.cat_pid = root.cat_id');
            $fields .= ', parent.cat_id as parent_id, parent.cat_name as parent_name, parent.cat_pid as parent_pid, parent.cat_level as parent_level';
            $fields .= ', root.cat_id as root_id, root.cat_name as root_name, root.cat_pid as root_pid, root.cat_level as root_level';
        }

        $record = $query
            ->where('current.cat_deleted', 0)
            ->where('current.cat_id', $id)
            ->field($fields)
            ->find();

        if (empty($record->id)) {
            abort(404, '此分类不存在');
        }

        $result['id'] = $record->id;
        $result['name'] = $record->name;
        $result['pid'] = $record->pid;
        $result['level'] = $record->level;

        if (!empty($record->parent_id)) {
            $result['parent']['id'] = $record->parent_id;
            $result['parent']['name'] = $record->parent_name;
            $result['parent']['pid'] = $record->parent_pid;
            $result['parent']['level'] = $record->parent_level;

            if (!empty($record->root_id)) {
                $result['parent']['parent']['id'] = $record->root_id;
                $result['parent']['parent']['name'] = $record->root_name;
                $result['parent']['parent']['pid'] = $record->root_pid;
                $result['parent']['parent']['level'] = $record->root_level;
            }
        }

        if (is_include('children')) {
            $children = $this->getCategoryChildren($record->id);
            if (count($children)) {
                $result['children'] = $children;
            }
        }

        return json($result);
    }

    /**
     * 获取指定ID对应的所有子分类列表
     *
     * GET /categories/:id/children
     */
    public function children($id)
    {
        $id = intval($id);

        if (empty($id)) {
            // abort(400, 'Bad Request');
            abort(400, '必须提供分类ID');
        }

        return json($this->getCategoryChildren($id));
    }
}
