const { dataController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const dataRoutes = require("express").Router();

// middleware that is specific to this route
dataRoutes.use((req, res, next) => {
  authMiddleware.verifyAddressMac(req, res, next);
});

dataRoutes.post("/", dataController.import);
dataRoutes.delete("/", dataController.clear);

module.exports = dataRoutes;
