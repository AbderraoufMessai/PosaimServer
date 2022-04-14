const DB = require("../models");
const model = DB.persons;

async function updateProfile(profile) {
  if (profile) {
    await DB.profiles.update(profile, { where: { id: profile.id } });
  }
}

exports.findAll = (req, res) => {
  const role = req.query.role;
  let where = {};
  if (role) {
    where.role = role;
  }
  model
    .findAll({
      attributes: ["id", "role", "remark", "balance", "createdAt", "updatedAt"],
      include: [
        {
          model: DB.profiles,
          as: "profile",
        },
        {
          model: DB.bills,
          as: "bills",
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
      attributes: ["id", "balance", "role", "remark", "createdAt", "updatedAt"],
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
              model: DB.payments,
              as: "payments",
              include: [
                {
                  model: DB.users,
                  as: "user",
                  include: [
                    {
                      model: DB.profiles,
                      as: "profile",
                    },
                  ],
                },
              ],
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
    .create(
      {
        remark: req.body.remark,
        role: req.body.role,
        profile: {
          firstname: req.body.profile.firstname,
          lastname: req.body.profile.lastname,
          gender: req.body.profile.gender,
          birthdate: req.body.profile.birthdate,
          phone: req.body.profile.phone,
          email: req.body.profile.email,
          address: req.body.profile.address,
          photo: req.body.profile.photo,
          barcode: barcode,
        },
      },
      {
        include: [DB.profiles],
      }
    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred." });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  let profile = null;
  if (req.body.profile) {
    profile = req.body.profile;
  }
  model
    .update(req.body, { where: { id: id } })
    .then(() => {
      updateProfile(profile).then(() => {
        model
          .findByPk(id, {
            attributes: [
              "id",
              "role",
              "remark",
              "balance",
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
    .findOne({ where: { personId: id } })
    .then((bill) => {
      if (!bill) {
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
                message: "Cannot delete person. Maybe was not found!",
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
          message: "Can't delete this person.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    });
};
