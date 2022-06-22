const { userController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const userRoutes = require("express").Router();

// middleware that is specific to this route
userRoutes.use((req, res, next) => {
  authMiddleware.verifyToken(req, res, next);
});

userRoutes.get("/", userController.findAll);
userRoutes.get("/:id", userController.findByPk);
userRoutes.get("/stats/:id", userController.stats);
userRoutes.put("/:id", userController.update);
userRoutes.delete("/:id", userController.destroy);

module.exports = userRoutes;
