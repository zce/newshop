/**
 * 订单商品表模型
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('OrderGoods', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    goods_id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false
    },
    goods_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    goods_number: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    goods_total_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    }
  }, {
    tableName: 'sp_order_goods'
  })
}
