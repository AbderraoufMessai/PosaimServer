const DB = require("../models");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = DB.users;
const Token = DB.tokens;

exports.login = (req, res) => {
  User.findOne({ where: { username: req.body.username, is_active: true } })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Not found." });
      }
      const valid_password = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!valid_password) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      const token = jwt.sign({ id: user.id }, config.tokenSecret);
      // { expiresIn: config.tokenLife });
      Token.update({ expired: true }, { where: { userId: user.id } })
        .then(() => {
          Token.create({ value: token, userId: user.id }).then(() => {
            User.findByPk(user.id, {
                  attributes: [
                    "id",
                    "username",
                    "last_login",
                    "is_active",
                    "is_superuser",
                    "createdAt",
                    "updatedAt"
                  ],
                  include: [
                    { model: DB.profiles, as: "profile" },
                  ],
              })
              .then((data) => {
                User.update({ last_login: Date.now() }, { where: { id: user.id } })
                .then(() => {
                  res.status(200).send({
                    user: data,
                    token: token,
                  });
                })
                .catch((err) => {
                      res.status(500).send({
                        message: err.message || "Error retrieving",
                      });
                });
              })
              .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred.",
                });
              });
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "Some error occurred." });
    });
};

exports.logout = (req, res) => {
  let token = req.headers.Authorization || req.headers.authorization;
  if (token) {
    Token.update({ expired: true }, { where: { value: token } })
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred.",
        });
      });
  } else {
    res.status(401).send({
      message: "Unauthorized.",
    });
  }
};

exports.register = (req, res) => {
  const barcode = null;
  User.create(
    {
      username: req.body.username,
      password: req.body.password ? bcrypt.hashSync(req.body.password) : null,
      profile: {
        firstname: req.body.profile.firstname,
        lastname: req.body.profile.lastname,
        gender: req.body.profile.gender,
        birthdate: req.body.profile.birthdate,
        phone: req.body.profile.phone,
        email: req.body.profile.email,
        address: req.body.profile.address,
        photo: req.body.profile.photo,
        barcode,
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
