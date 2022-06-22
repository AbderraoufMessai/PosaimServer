module.exports = (Database, Sequelize) => {
  return Database.define("product", {
    barcode: {
      type: Sequelize.STRING,
      unique: true,
    },
    ref: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    brand: {
      type: Sequelize.STRING,
    },
    photo: {
      type: Sequelize.BLOB,
    },
    location: {
      type: Sequelize.STRING,
    },
    qty: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    purchase_price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    selling_price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    wholesale_price: {
      type: Sequelize.INTEGER,
    },
    wholesale_qty: {
      type: Sequelize.INTEGER,
    },
    expiration_date: {
      type: Sequelize.DATEONLY,
    },
  });
};
