module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Category', {
    cat_id: {
      type: DataTypes.INTEGER(32),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cat_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cat_pid: {
      type: DataTypes.INTEGER(32),
      allowNull: true
    },
    cat_level: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'sp_category'
  })

  model.findCascading = function () {
    return this.findAll()
      .then(records => {
        const recursion = pid => records
          .filter(r => r.cat_pid === pid)
          .map(r => {
            r.children = recursion(r.cat_id)
            return r
          })
        return recursion(0)
      })
  }

  return model
}
