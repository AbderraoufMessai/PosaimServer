const { personController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const personRoutes = require("express").Router();

// middleware that is specific to this route
personRoutes.use((req, res, next) => {
  authMiddleware.verifyToken(req, res, next);
});

personRoutes.get("/", personController.findAll);
personRoutes.get("/:id", personController.findByPk);
personRoutes.post("/", personController.create);
personRoutes.put("/:id", personController.update);
personRoutes.delete("/:id", personController.destroy);

module.exports = personRoutes;
