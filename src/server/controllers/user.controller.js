const DB = require("../models");
const model = DB.users;

exports.findAll = (req, res) => {
  model
    .findAll({
      attributes: ["id", "last_login", "is_active", "createdAt", "updatedAt"],
      include: [
        {
          model: DB.profiles,
          as: "profile",
        },
      ],
      where: { is_superuser: false },
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
      attributes: [
        "id",
        "last_login",
        "is_active",
        "is_superuser",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: DB.profiles,
          as: "profile",
        },
        {
          model: DB.bills,
          as: "bills",
          include: [
            {
              model: DB.items,
              as: "items",
              include: [
                {
                  model: DB.products,
                  as: "product",
                },
              ],
            },
            {
              model: DB.persons,
              as: "person",
              include: [
                {
                  model: DB.profiles,
                  as: "profile",
                },
              ],
            },
          ],
        },
        {
          model: DB.payments,
          as: "payments",
          include: [
            {
              model: DB.bills,
              as: "bill",
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

exports.update = (req, res) => {
  const id = req.params.id;
  model
    .update({ is_active: req.body.is_active }, { where: { id: id } })
    .then(() => {
      model
        .findByPk(id, {
          attributes: [
            "id",
            "last_login",
            "is_active",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: DB.profiles,
              as: "profile",
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
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating",
      });
    });
};

exports.destroy = (req, res) => {
  const id = req.params.id;
  DB.bills
    .findOne({ where: { userId: id } })
    .then((bill) => {
      if (!bill) {
        DB.payments
          .findOne({ where: { userId: id } })
          .then((payment) => {
            if (payment) {
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
                      message: "Cannot delete user. Maybe was not found!",
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
                message: "Can't delete this user.",
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred.",
            });
          });
      } else {
        res.status(500).send({
          message: "Can't delete this user.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};
