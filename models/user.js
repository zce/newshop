/**
 * 用户表模型
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: ''
    },
    qq_open_id: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    password: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      defaultValue: ''
    },
    user_email: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    user_email_code: {
      type: DataTypes.CHAR(13),
      allowNull: true
    },
    is_active: {
      type: DataTypes.ENUM('是', '否'),
      allowNull: true,
      defaultValue: '否'
    },
    user_sex: {
      type: DataTypes.ENUM('保密', '女', '男'),
      allowNull: false,
      defaultValue: '男'
    },
    user_qq: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    user_tel: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    user_xueli: {
      type: DataTypes.ENUM('博士', '硕士', '本科', '专科', '高中', '初中', '小学'),
      allowNull: false,
      defaultValue: '本科'
    },
    user_hobby: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ''
    },
    user_introduce: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    update_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'sp_user'
  })
}
