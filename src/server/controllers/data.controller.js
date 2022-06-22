const DB = require("../models");

const removeReputation = async (products) => {
  let result = [];
  for (const product of products) {
    await DB.products
      .findOne({ where: { barcode: product.barcode } })
      .then((item) => {
        if (!item) {
          result.push(item);
        }
      });
  }
  return result;
};

exports.import = async (req, res) => {
  let products = req.body.products;
  await DB.products
    .bulkCreate(products)
    .then(() => {
      res.send({ message: "Import all products successful" });
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

exports.clear = (req, res) => {
  DB.Database.sync({ force: true })
    .then(() => {
      res.send({ message: "Clear data success." });
    })
    .catch(() => {
      res.status(500).send({ message: "Deleted data error." });
    });
};
