const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const Port = process.env.PORT || 3000;

const authJwt = require("./helpers/jwt");

require("dotenv").config();

const errorHandler = require("./helpers/error-handler");
app.use(cors());
app.options("*", cors());
//require("dotenv").config({ path: "/.env" });
// Middleware configurations
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(userRoute);
app.use(productRoute);
app.use(categoryRoute);
app.use(orderRoute);

const DB = process.env.DB;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("database connection established");
  })
  .catch((err) => console.log("database connection failed", err));
app.listen(Port, () => {
  //console.log(process.env.CONNECTION_STRING);
  console.log("listening on port", Port);
});
