module.exports = (Database, Sequelize) => {
  return Database.define("bill", {
    total: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    rest: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "INCOMPLETE",
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    barcode: {
      type: Sequelize.STRING,
      unique: true,
    },
  });
};
