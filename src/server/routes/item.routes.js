const { itemController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const itemRoutes = require("express").Router();

// middleware that is specific to this route
itemRoutes.use((req, res, next) => {
  authMiddleware.verifyToken(req, res, next);
});

itemRoutes.get("/", itemController.findAll);
itemRoutes.post("/", itemController.create);
itemRoutes.put("/:id", itemController.update);
itemRoutes.delete("/:id", itemController.destroy);

module.exports = itemRoutes;
