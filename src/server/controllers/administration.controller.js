const DB = require("../models");
const bcrypt = require("bcryptjs");

exports.createAdmin = (req, res) => {
  DB.users.findOne({ where: { is_superuser: true } }).then((data) => {
    if (!data) {
      DB.users
        .create({
          username: req.body.username,
          password: req.body.password
            ? bcrypt.hashSync(req.body.password)
            : null,
          is_superuser: true,
          is_active: true,
        })
        .then(() => {
          res.send({ message: "Created admin success." });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: err.message || "Some error occurred." });
        });
    } else {
      DB.users
        .update(
          {
            username: req.body.username,
            password: req.body.password
              ? bcrypt.hashSync(req.body.password)
              : null,
          },
          { where: { is_superuser: true } }
        )
        .then(() => {
          res.send({ message: "Updated admin success." });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: err.message || "Some error occurred." });
        });
    }
  });
};
