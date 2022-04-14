const Sequelize = require("sequelize");
const config = require("../config/database.config");
const Database = new Sequelize(config);

const DB = {
  Sequelize,
  Database,
  users: require("./user.model.js")(Database, Sequelize),
  persons: require("./person.model.js")(Database, Sequelize),
  profiles: require("./profile.model.js")(Database, Sequelize),
  tokens: require("./token.model")(Database, Sequelize),
  products: require("./product.model.js")(Database, Sequelize),
  bills: require("./bill.model.js")(Database, Sequelize),
  payments: require("./payment.model.js")(Database, Sequelize),
  items: require("./item.model.js")(Database, Sequelize),
};

DB.tokens.belongsTo(DB.users); // Will add userId to token
DB.users.hasMany(DB.tokens);

DB.users.belongsTo(DB.profiles);
DB.profiles.hasOne(DB.users);

DB.persons.belongsTo(DB.profiles);
DB.profiles.hasOne(DB.persons);

DB.bills.belongsTo(DB.users);
DB.users.hasMany(DB.bills);

DB.bills.belongsTo(DB.persons);
DB.persons.hasMany(DB.bills);

DB.payments.belongsTo(DB.bills);
DB.bills.hasMany(DB.payments);

DB.payments.belongsTo(DB.users);
DB.users.hasMany(DB.payments);

DB.items.belongsTo(DB.bills);
DB.bills.hasMany(DB.items);

DB.items.belongsTo(DB.products);
DB.products.hasMany(DB.items);

module.exports = DB;
