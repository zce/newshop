module.exports = (sequelize, DataTypes) => {
  return sequelize.define('GoodsCats', {
    cat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    cat_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_show: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    cat_sort: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    data_flag: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    create_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'sp_goods_cats'
  })
}
