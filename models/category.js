module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Category', {
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
    cat_lvl: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'sp_category'
  })
}
