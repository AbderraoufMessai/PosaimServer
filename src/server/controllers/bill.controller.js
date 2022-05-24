const DB = require("../models");
const model = DB.bills;

exports.findAll = (req, res) => {
  const userId = req.userId;
  const is_superuser = req.is_superuser;
  const status = req.query.status;
  const type = req.query.type;
  let where = {};
  if (status) {
    where.status = status;
  }
  if (type) {
    where.type = type;
  }
  if (!is_superuser) {
    where.userId = userId;
  }
  model
    .findAll({
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
      where,
    })
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
          model: DB.users,
          as: "user",
          include: [{ model: DB.profiles, as: "profile" }],
        },
        {
          model: DB.persons,
          as: "person",
          include: [{ model: DB.profiles, as: "profile" }],
        },
        {
          model: DB.items,
          as: "items",
          include: [{ model: DB.products, as: "product" }],
        },
        {
          model: DB.payments,
          as: "payments",
          include: [
            {
              model: DB.users,
              as: "user",
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

exports.create = (req, res) => {
  const barcode = null;
  model
    .create({
      type: req.body.type,
      barcode: barcode,
      userId: req.userId,
      personId: req.body.personId,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred." });
    });
};

exports.destroy = (req, res) => {
  const id = req.params.id;
  DB.bills
    .findOne({ where: { id } })
    .then((bill) => {
      if (bill) {
        if (bill.status === "INCOMPLETE") {
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
                  message: "Cannot delete bill. Maybe was not found!",
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
            message: "Can't delete this bill.",
          });
        }
      } else {
        res.status(500).send({
          message: "Can't delete this bill.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};
