module.exports = (Database, Sequelize) => {
  return Database.define("token", {
    value: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expired: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
};
