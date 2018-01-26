/**
 * 购物车表模型
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserCart', {
    cart_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    cart_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    delete_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'sp_user_cart'
  })
}
