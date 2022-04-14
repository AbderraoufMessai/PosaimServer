const { administrationController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const administrationRoutes = require("express").Router();

// middleware that is specific to this route
administrationRoutes.use((req, res, next) => {
    authMiddleware.verifyAddressMac(req, res, next);
});

administrationRoutes.post("/", administrationController.createAdmin);
administrationRoutes.put("/", administrationController.updateAdmin);

module.exports = administrationRoutes;
