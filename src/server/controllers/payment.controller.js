const DB = require("../models");
const model = DB.payments;

async function updateProducts(items, type) {
  if (items) {
    for (let { productId, qty, price } of items) {
      await DB.products.findByPk(productId).then(async (product) => {
        if (type === "SALE") {
          qty = parseInt(product.qty) - parseInt(qty);
          await DB.products.update({ qty }, { where: { id: productId } });
        } else {
          qty = parseInt(product.qty) + parseInt(qty);
          await DB.products.update(
            { qty, purchase_price: price },
            { where: { id: productId } }
          );
        }
      });
    }
  }
}
async function updateBill(id, personId, items, type, amount) {
  if (id) {
    await DB.bills.findByPk(id).then(async (bill) => {
      if (bill) {
        let item = {};
        if (bill.status === "COMPLETE") {
          item.rest = parseInt(bill.rest) - parseInt(amount);
          await DB.bills.update(item, { where: { id } });
        } else {
          item.status = "COMPLETE";
          item.datetime = new Date();
          if (personId) {
            item.personId = personId;
          }
          if (amount) {
            item.rest = parseInt(bill.rest) - parseInt(amount);
          }
          await DB.bills
            .update(item, { where: { id } })
            .then(async () => {
              await updateProducts(items, type);
            })
            .then(async () => {
              await updatePerson(personId, bill.total);
            });
        }
      }
    });
  }
}
async function updatePerson(id, value) {
  value = parseInt(value);
  if (id && value !== 0) {
    await DB.persons.findByPk(id).then(async (person) => {
      let balance = parseInt(person.balance) + value;
      await DB.persons.update({ balance }, { where: { id } });
    });
  }
}

exports.findAll = (req, res) => {
  const userId = req.userId;
  const is_superuser = req.is_superuser;
  let where = {};
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
          model: DB.bills,
          as: "bill",
          include: [
            {
              model: DB.persons,
              as: "person",
              include: [{ model: DB.profiles, as: "profile" }],
            },
          ],
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
          model: DB.bills,
          as: "bill",
          include: [
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
  const userId = req.userId;
  const billId = req.body.billId;
  const personId = req.body.personId;
  const amount = req.body.amount;
  const items = req.body.items;
  const type = req.body.type;
  const datetime = new Date();
  if (amount > 0) {
    model
      .create({
        userId,
        billId,
        amount,
        datetime,
      })
      .then((data) => {
        updateBill(billId, personId, items, type, amount)
          .then(() => {
            updatePerson(personId, parseInt(-amount))
              .then(() => {
                res.send(data);
              })
              .catch((err) => {
                res
                  .status(500)
                  .send({ message: err.message || "Error in update person." });
              });
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: err.message || "Error in update bill." });
          });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: err.message || "Some error occurred." });
      });
  } else {
    updateBill(billId, personId, items, type)
      .then(() => {
        res.send();
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: err.message || "Error in update bill." });
      });
  }
};
