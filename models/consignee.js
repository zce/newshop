/**
 * 收货地址表模型
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Consignee', {
    cgn_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    cgn_name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    cgn_address: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: ''
    },
    cgn_tel: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    cgn_code: {
      type: DataTypes.CHAR(6),
      allowNull: false,
      defaultValue: ''
    },
    delete_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'sp_consignee'
  })
}
