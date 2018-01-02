module.exports = (sequelize, DataTypes) => {
  return sequelize.define('GoodsAttr', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    goods_id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false
    },
    attr_id: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: false
    },
    attr_value: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    add_price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'sp_goods_attr'
  })
}
