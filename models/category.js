/**
 * 分类表模型
 */
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
}
