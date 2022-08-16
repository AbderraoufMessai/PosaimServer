module.exports = (Database, Sequelize) => {
  return Database.define("user", {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_login: {
      type: Sequelize.DATE,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_superuser: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
};
