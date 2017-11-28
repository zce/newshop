module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PermissionApi', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ps_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ps_api_service: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ps_api_action: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ps_api_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'sp_permission_api'
  })
}
