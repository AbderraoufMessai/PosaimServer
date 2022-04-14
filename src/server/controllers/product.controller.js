const DB = require("../models");
const model = DB.products;

exports.findAll = (req, res) => {
  model
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};

exports.findByPk = (req, res) => {
  const id = req.params.id;
  model
    .findByPk(id, {
      include: [
        {
          model: DB.items,
          as: "items",
          include: [
            {
              model: DB.users,
              as: "user",
              include: [{ model: DB.profiles, as: "profile" }],
            },
            {
              model: DB.persons,
              as: "person",
              include: [{ model: DB.profiles, as: "profile" }],
            },
          ],
        },
      ],
    })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving",
      });
    });
};

exports.findByBarcode = (req, res) => {
  const barcode = req.params.barcode;
  model
    .findOne({
      where: { barcode: barcode },
    })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving",
      });
    });
};

exports.create = (req, res) => {
  model
    .create({
      barcode: req.body.barcode,
      ref: req.body.ref,
      name: req.body.name,
      brand: req.body.brand,
      photo: req.body.photo,
      location: req.body.location,
      selling_price: req.body.selling_price,
      wholesale_price: req.body.wholesale_price,
      wholesale_qty: req.body.wholesale_qty,
      expiration_date: req.body.expiration_date,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred." });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  model
    .update(req.body, { where: { id: id } })
    .then(() => {
      model
        .findByPk(id)
        .then((data) => {
          if (data) {
            res.send(data);
          } else {
            res.status(404).send({
              message: "Not Found",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error retrieving",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating",
      });
    });
};

exports.destroy = (req, res) => {
  const id = req.params.id;
  DB.items
    .findOne({ where: { productId: id } })
    .then((item) => {
      if (!item) {
        model
          .destroy({
            where: { id: id },
          })
          .then((num) => {
            if (num === 1) {
              res.send({
                message: "Deleted successfully!",
              });
            } else {
              res.send({
                message: "Cannot delete item. Maybe was not found!",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Could not delete",
            });
          });
      } else {
        res.status(500).send({
          message: "Can't delete this product.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};
