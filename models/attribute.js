/**
 * 属性表模型
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Attribute', {
    attr_id: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    attr_name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    cat_id: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: false
    },
    attr_sel: {
      type: DataTypes.ENUM('only', 'many'),
      allowNull: false,
      defaultValue: 'only'
    },
    attr_write: {
      type: DataTypes.ENUM('manual', 'list'),
      allowNull: false,
      defaultValue: 'manual'
    },
    attr_vals: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    delete_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'sp_attribute'
  })
}
