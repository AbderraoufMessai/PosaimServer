const controllers = {
  authController: require("./auth.controller"),
  userController: require("./user.controller.js"),
  personController: require("./person.controller.js"),
  profileController: require("./profile.controller"),
  billController: require("./bill.controller"),
  productController: require("./product.controller"),
  itemController: require("./item.controller"),
  paymentController: require("./payment.controller"),
  dataController: require("./data.controller"),
  administrationController: require("./administration.controller"),
  statsController: require("./stats.controller"),
};

module.exports = controllers;
