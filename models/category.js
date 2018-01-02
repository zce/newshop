module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Category', {
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
    },
    cat_deleted: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
      defaultValue: '0'
    },
    cat_icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cat_src: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'sp_category'
  })

  Model.findCascading = () => Model.findAll({ where: { cat_deleted: 0 } })
    .then(records => {
      const recursion = pid => records
        .filter(r => r.cat_pid === pid)
        .map(r => {
          r.children = recursion(r.cat_id)
          return r
        })
      return recursion(0)
    })

  return Model
}
