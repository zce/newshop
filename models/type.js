module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Type', {
    type_id: {
      type: DataTypes.INTEGER(5).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type_name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    delete_time: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'sp_type'
  })
}
