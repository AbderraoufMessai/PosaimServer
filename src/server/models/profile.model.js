module.exports = (Database, Sequelize) => {
  return Database.define("profile", {
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.VIRTUAL,
      get() {
        return `${this.firstname} ${this.lastname}`;
      },
    },
    gender: {
      type: Sequelize.STRING,
    },
    birthdate: {
      type: Sequelize.DATEONLY,
    },
    phone: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    address: {
      type: Sequelize.STRING,
    },
    barcode: {
      type: Sequelize.STRING,
      unique: true,
    },
    photo: {
      type: Sequelize.TEXT,
    },
  });
};
