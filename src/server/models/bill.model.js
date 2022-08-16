module.exports = (Database, Sequelize) => {
  return Database.define("bill", {
    total: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    rest: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "INCOMPLETE",
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    datetime: {
      type: Sequelize.DATE,
    },
    barcode: {
      type: Sequelize.STRING,
      unique: true,
    },
  });
};
