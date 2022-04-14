const { authController } = require("../controllers");
const authRoutes = require("express").Router();

// middleware that is specific to this route
authRoutes.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

authRoutes.post("/login", authController.login);
authRoutes.get("/logout", authController.logout);
authRoutes.post("/register", authController.register);

module.exports = authRoutes;
