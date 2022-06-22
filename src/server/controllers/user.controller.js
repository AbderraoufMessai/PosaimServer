const DB = require("../models");
const model = DB.users;

const userStats = (data) => {
  const item = data;
  let today = new Date();
  today.setHours(1, 0, 0, 0);
  const sales = item.bills.filter((el) => {
    let datetime = new Date(el.datetime);
    return (
      el.type === "SALE" &&
      el.status === "COMPLETE" &&
      datetime.getTime() >= today.getTime()
    );
  });
  const purchases = item.bills.filter((el) => {
    let datetime = new Date(el.datetime);
    return (
      el.type === "PURCHASE" &&
      el.status === "COMPLETE" &&
      datetime.getTime() >= today.getTime()
    );
  });
  const paymentsIn = item.payments.filter((el) => {
    let datetime = new Date(el.datetime);
    return el.bill.type === "SALE" && datetime.getTime() >= today.getTime();
  });
  const paymentsOut = item.payments.filter((el) => {
    let datetime = new Date(el.datetime);
    return el.bill.type === "PURCHASE" && datetime.getTime() >= today.getTime();
  });
  const tokens = item.tokens;

  let worktimes = [];
  for (let j = 0; j < tokens.length; j++) {
    const { createdAt, updatedAt } = tokens[j];
    let time = new Date(updatedAt) - new Date(createdAt);
    let date = createdAt.toISOString().split("T")[0];
    let index = worktimes.findIndex((item) => item.date === date);
    if (index !== -1) {
      worktimes[index].time += time;
    } else {
      worktimes.push({ time, date });
    }
  }

  let salesTotal = sales.reduce((sum, el) => sum + el.total, 0);
  let purchasesTotal = purchases.reduce((sum, el) => sum + el.total, 0);

  let paymentsTotalIn = paymentsIn.reduce((sum, el) => sum + el.amount, 0);
  let paymentsTotalOut = paymentsOut.reduce((sum, el) => sum + el.amount, 0);

  let debtsIn = sales.reduce((sum, el) => sum + el.rest, 0);
  let debtsOut = purchases.reduce((sum, el) => sum + el.rest, 0);

  let element = {
    sales: { total: salesTotal, items: sales.length },
    purchases: { total: purchasesTotal, items: purchases.length },
    payments: {
      in: { total: paymentsTotalIn, items: paymentsIn.length },
      out: { total: paymentsTotalOut, items: paymentsOut.length },
    },
    debts: {
      in: debtsIn,
      out: debtsOut,
    },
    worktimes,
  };
  return element;
};

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

exports.stats = (req, res) => {
  const id = req.params.id;
  // const id = req.userId;
  DB.users
    .findByPk(id, {
      attributes: ["username"],
      include: [
        {
          model: DB.profiles,
          attributes: ["name"],
        },
        {
          model: DB.bills,
          attributes: ["type", "total", "status", "rest", "datetime"],
        },
        {
          model: DB.payments,
          attributes: ["amount", "datetime"],
          include: [
            {
              model: DB.bills,
              attributes: ["type"],
            },
          ],
        },
        {
          model: DB.tokens,
          attributes: ["createdAt", "updatedAt"],
        },
      ],
    })
    .then((data) => {
      if (data) {
        res.send(userStats(data));
      } else {
        res.status(404).send({
          message: "Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
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
