module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Express', {
    express_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    express_com: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    express_nu: {
      type: DataTypes.STRING(32),
      allowNull: true
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
    tableName: 'sp_express'
  })
}
