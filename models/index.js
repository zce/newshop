const glob = require('glob')
const Sequelize = require('sequelize')

const config = require('../config')

const defaultOptions = {
  define: {
    timestamps: false
  }
}

const sequelize = new Sequelize(Object.assign({}, defaultOptions, config.database))

glob.sync('./*.js', { cwd: __dirname })
  .filter(item => item !== './index.js')
  .forEach(item => {
    const model = sequelize.import(item)
    exports[model.name] = model
  })

exports.sequelize = sequelize
exports.Sequelize = Sequelize
