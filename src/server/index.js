const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors({ origin: "*" }));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Supermarket server API." });
});
// test connection
app.get("/api", (req, res) => {
  res.json({ code: process.env.SECRET_KEY });
});

// api routes
app.use("/api/auth", routes.authRoutes);
app.use("/api/users", routes.userRoutes);
app.use("/api/persons", routes.personRoutes);
app.use("/api/bills", routes.billRoutes);
app.use("/api/products", routes.productRoutes);
app.use("/api/profiles", routes.profileRoutes);
app.use("/api/items", routes.itemRoutes);
app.use("/api/payments", routes.paymentRoutes);
app.use("/api/data", routes.dataRoutes);
app.use("/api/administration", routes.administrationRoutes);

const startServer = () => {
  const PORT = process.env.API_PORT || 8000;
  const IP = process.env.API_IP || "0.0.0.0";
  return app.listen(PORT, IP);
};
const closeServer = (server) => {
  server.close();
};

export { startServer, closeServer };
