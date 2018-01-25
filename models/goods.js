/**
 * 商品表模型
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Goods', {
    goods_id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    goods_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    goods_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    goods_number: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    goods_weight: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    cat_id: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    goods_introduce: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    goods_big_logo: {
      type: DataTypes.CHAR(128),
      allowNull: false,
      defaultValue: ''
    },
    goods_small_logo: {
      type: DataTypes.CHAR(128),
      allowNull: false,
      defaultValue: ''
    },
    is_del: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: '0'
    },
    add_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    upd_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    delete_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cat_one_id: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '0'
    },
    cat_two_id: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '0'
    },
    cat_three_id: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '0'
    },
    hot_mumber: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    is_promote: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '0'
    },
    goods_state: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'sp_goods'
  })
}
