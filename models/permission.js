module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Permission', {
    ps_id: {
      type: DataTypes.INTEGER(6).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ps_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ps_pid: {
      type: DataTypes.INTEGER(6).UNSIGNED,
      allowNull: false
    },
    ps_c: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    ps_a: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    ps_level: {
      type: DataTypes.ENUM('0', '2', '1'),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'sp_permission'
  })
}
