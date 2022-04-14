const { productController } = require("../controllers");
const { authMiddleware } = require("../middleware");
const productRoutes = require("express").Router();

// middleware that is specific to this route
productRoutes.use((req, res, next) => {
  authMiddleware.verifyToken(req, res, next);
});

productRoutes.get("/", productController.findAll);
productRoutes.get("/:id", productController.findByPk);
productRoutes.get("/barcode/:barcode", productController.findByBarcode);
productRoutes.post("/", productController.create);
productRoutes.put("/:id", productController.update);
productRoutes.delete("/:id", productController.destroy);

module.exports = productRoutes;
