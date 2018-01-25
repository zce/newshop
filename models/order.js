/**
 * 订单表模型
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: false
    },
    order_number: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true
    },
    order_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    order_pay: {
      type: DataTypes.ENUM('0', '1', '2', '3'),
      allowNull: false,
      defaultValue: '1'
    },
    is_send: {
      type: DataTypes.ENUM('是', '否'),
      allowNull: false,
      defaultValue: '否'
    },
    trade_no: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    order_fapiao_title: {
      type: DataTypes.ENUM('个人', '公司'),
      allowNull: false,
      defaultValue: '个人'
    },
    order_fapiao_company: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    order_fapiao_content: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    consignee_addr: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pay_status: {
      type: DataTypes.ENUM('0', '1'),
      allowNull: false,
      defaultValue: '0'
    },
    create_time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    update_time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    }
  }, {
    tableName: 'sp_order'
  })
}
