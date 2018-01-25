/**
 * 商品图片表模型
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('GoodsPics', {
    pics_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    goods_id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false
    },
    pics_big: {
      type: DataTypes.CHAR(128),
      allowNull: false,
      defaultValue: ''
    },
    pics_mid: {
      type: DataTypes.CHAR(128),
      allowNull: false,
      defaultValue: ''
    },
    pics_sma: {
      type: DataTypes.CHAR(128),
      allowNull: false,
      defaultValue: ''
    }
  }, {
    tableName: 'sp_goods_pics'
  })
}
