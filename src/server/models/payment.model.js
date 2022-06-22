module.exports = (Database, Sequelize) => {
  return Database.define("payment", {
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    datetime: {
      type: Sequelize.DATE,
    },
  });
};
