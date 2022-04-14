module.exports = (Database, Sequelize) => {
  return Database.define("item", {
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    total: {
      type: Sequelize.VIRTUAL,
      get() {
        return parseInt(this.qty) * parseInt(this.price);
      },
    },
  });
};
