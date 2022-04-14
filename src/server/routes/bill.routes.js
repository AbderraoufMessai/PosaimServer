const { billController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const billRoutes = require("express").Router();

// middleware that is specific to this route
billRoutes.use((req, res, next) => {
  authMiddleware.verifyToken(req, res, next);
});

billRoutes.get("/", billController.findAll);
billRoutes.get("/:id", billController.findByPk);
billRoutes.post("/", billController.create);

module.exports = billRoutes;
