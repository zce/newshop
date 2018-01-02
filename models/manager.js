module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Manager', {
    mg_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mg_name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    mg_pwd: {
      type: DataTypes.CHAR(64),
      allowNull: false
    },
    mg_time: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    mg_mobile: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    mg_email: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    mg_state: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    tableName: 'sp_manager'
  })
}
