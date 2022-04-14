const DB = require("../models");
const models = [
  "profiles",
  "products",
  "users",
  "persons",
  "bills",
  "items",
  "payments",
  "tokens",
];

const isEmpty = async () => {
  let response = {};
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await DB[model].findAll().then((data) => {
      response = data.length === 0;
    });
    if (!response) {
      return response;
    }
  }
  return response;
};

const validateItems = async (model, items) => {
  let response = true;
  let error = null;
  for (const item of items) {
    switch (model) {
      case "persons":
        response = !!item.id && !!item.role && !!item.profileId;
        break;
      case "bills":
        response = !!item.id && !!item.type && !!item.userId && !!item.personId;
        break;
      case "items":
        response =
          !!item.id &&
          !!item.qty &&
          !!item.price &&
          !!item.productId &&
          !!item.billId;
        break;
      case "payments":
        response = !!item.id && !!item.amount && !!item.userId && !!item.billId;
        break;
      case "products":
        response = !!item.id && !!item.name && !!item.selling_price;
        break;
      case "profiles":
        response = !!item.id && !!item.firstname && !!item.lastname;
        break;
      case "tokens":
        response = !!item.id && !!item.value && !!item.expired && !!item.userId;
        break;
      case "users":
        response = !!item.id && !!item.username && !!item.password;
        break;
      default:
        response = false;
        break;
    }
    if (!response) {
      error = { model, item };
      return { response, error };
    }
  }
  return { response, error };
};

const deleteAllData = async () => {
  let response = true;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await DB[model]
      .destroy({
        where: {},
        truncate: true,
      })
      .catch(() => {
        return false;
      });
  }
  return response;
};

const getAllData = async () => {
  const response = {};
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await DB[model].findAll().then((data) => {
      response[model] = data;
    });
  }
  return response;
};

const addAllData = async (data) => {
  let response = true;
  let error = null;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const items = data[model];
    const valid = await validateItems(model, items);
    if (valid.response) {
      await DB[model].bulkCreate(items).catch((err) => {
        return { response: false, error: { model, err } };
      });
    } else {
      return { response: false, error: valid.error };
    }
  }
  return { response, error };
};

exports.export = (req, res) => {
  getAllData().then((data) => {
    data.createdAt = Date.now();
    res.send(data);
  });
};

exports.import = (req, res) => {
  const data = req.body.data;
  console.log(data);
  if (data) {
    isEmpty().then((is_empty) => {
      if (is_empty) {
        addAllData(data).then((response) => {
          if (response.response) {
            res.send({ message: "import success" });
          } else {
            deleteAllData().then(() => {
              res
                .status(500)
                .send({ message: "import error", error: response.error });
            });
          }
        });
      } else {
        res
          .status(500)
          .send({ message: "import error", error: "Database is not empty!" });
      }
    });
  } else {
    res
      .status(500)
      .send({ message: "import error", error: "Data not defined" });
  }
};

exports.destroy = (req, res) => {
  deleteAllData().then((response) => {
    if (response) {
      res.send({ message: "deleted success" });
    } else {
      res.status(500).send({ message: "deleted error" });
    }
  });
};
