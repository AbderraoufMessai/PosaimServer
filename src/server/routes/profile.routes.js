const { profileController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const profileRoutes = require("express").Router();

// middleware that is specific to this route
profileRoutes.use((req, res, next) => {
  authMiddleware.verifyToken(req, res, next);
});

profileRoutes.get("/:id", profileController.findByPk);
profileRoutes.put("/:id", profileController.update);

module.exports = profileRoutes;
