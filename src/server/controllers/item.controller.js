const DB = require("../models");
const model = DB.items;

async function updateBill(id) {
  model.findAll({ where: { billId: id } }).then(async (items) => {
    let total = items.reduce(
      (last, item) => last + parseInt(item.price) * parseInt(item.qty),
      0
    );
    await DB.bills.update({ total, rest: total }, { where: { id } });
  });
}

exports.findAll = (req, res) => {
  const billId = req.query.billId;
  let where = {};
  if (billId) {
    where.billId = billId;
  }
  model
    .findAll({
      include: [
        {
          model: DB.products,
          as: "product",
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

exports.create = (req, res) => {
  const billId = req.body.billId;
  const productId = req.body.productId;
  const qty = req.body.qty;
  const price = req.body.price;
  model
    .create({ billId, productId, qty, price })
    .then((item) => {
      updateBill(billId).then(() => {
        model
          .findByPk(item.id, {
            include: [
              {
                model: DB.products,
                as: "product",
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
          });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred." });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  model
    .update(
      {
        qty: req.body.qty,
        price: req.body.price,
      },
      {
        where: { id: id },
      }
    )
    .then(() => {
      updateBill(req.body.billId).then(() => {
        model
          .findByPk(id, {
            include: [
              {
                model: DB.products,
                as: "product",
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
  model
    .findByPk(id, {
      include: [{model: DB.bills}]
    }).then((data) => {
      const bill = data.bill;
      if (bill) {
        model
          .destroy({
            where: { id: id },
          })
          .then((num) => {
            if (num === 1) {
              updateBill(bill.id).then(() => {
                res.send({
                  message: "Deleted successfully!",
                });
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
        res.send({
          message: "Cannot delete item. err in bill!",
        });
      }
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete",
      });
    });
};
