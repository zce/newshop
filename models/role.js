module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Role', {
    role_id: {
      type: DataTypes.INTEGER(6).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ps_ids: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: ''
    },
    ps_ca: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    role_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'sp_role'
  })
}
