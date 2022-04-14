const DB = require("../models");
const model = DB.profiles;

exports.findByPk = (req, res) => {
  const id = req.params.id;
  model
    .findByPk(id)
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
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: "Updated successfully.",
        });
      } else {
        res.send({
          message: "Cannot update. Maybe Item was not found!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating",
      });
    });
};
