module.exports = (Database, Sequelize) => {
  return Database.define("person", {
    balance: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    remark: {
      type: Sequelize.TEXT,
    },
    is_blocked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
};
