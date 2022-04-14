const DB = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const getmac = require("getmac");

const Token = DB.tokens;
const User = DB.users;

const verifyToken = (req, res, next) => {
  let token = req.headers.Authorization || req.headers.authorization;
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    Token.findOne({ where: { value: token, expired: false } })
      .then((find) => {
        if (find) {
          const userId = decoded.id;
          User.findByPk(userId).then((user) => {
            req.userId = userId;
            req.is_superuser = user.is_superuser;
            next();
          });
        } else {
          return res.status(401).send({
            message: "Token expired!",
          });
        }
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Some error occurred.",
        });
      });
  });
};

const verifyAddressMac = (req, res, next) => {
  let mac = req.headers.mac
  if (!mac) {
    return res.status(403).send({
      message: "No addresss provided!",
    });
  }
  if (mac === getmac.default()) {
    next();
  } else {
    return res.status(401).send({
      message: "Unauthorized!",
    });
  }
};

const authMiddleware = {
  verifyToken,
  verifyAddressMac,
};

module.exports = authMiddleware;
