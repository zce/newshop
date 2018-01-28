/**
 * 自动载入所有模型并导出
 * sequelize 的使用可以参考：
 * - https://github.com/sequelize/express-example
 */

const glob = require('glob')
const Sequelize = require('sequelize')

const config = require('../config')

const sequelize = new Sequelize(Object.assign(config.database, {
  // 由于数据库每张表中没有 sequelize 对应的时间戳字段，
  // 所以必须关闭 sequelize 自动生成时间戳的功能
  define: { timestamps: false }
}))

// 自动载入当前目录下所有的 JS 文件
glob.sync('*.js', { cwd: __dirname })
  // 忽略 index.js 文件，因为它不是模型文件
  .filter(item => item !== 'index.js')
  // 遍历每一个模型文件名
  .forEach(item => {
    // 通过 sequelize 导入模型
    // 注意：这里的模型文件不能单独使用，必须通过 `sequelize.import()` 才可以使用
    const model = sequelize.import(item)
    // 将模型对象导出
    exports[model.name] = model
  })
