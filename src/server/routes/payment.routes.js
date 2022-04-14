const { paymentController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const paymentRoutes = require("express").Router();

// middleware that is specific to this route
paymentRoutes.use((req, res, next) => {
  authMiddleware.verifyToken(req, res, next);
});

paymentRoutes.get("/", paymentController.findAll);
paymentRoutes.get("/:id", paymentController.findByPk);
paymentRoutes.post("/", paymentController.create);

module.exports = paymentRoutes;
