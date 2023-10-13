require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/mongodb");
const morgan = require("morgan");
var cors = require("cors");

const app = express();
const {
  loginRoute,
  shopRoute,
  architectureRoute,
  carpenterRoute,
  userRoute,
  salesPersonRouter,
  followRoutes,
} = require("./App/router/timberland.Routes");
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
connectDB();

app.use("/api", loginRoute);
app.use("/api", shopRoute);
app.use("/api", architectureRoute);
app.use("/api", carpenterRoute);
app.use("/api", userRoute);
app.use('/api', salesPersonRouter)
app.use('/api', followRoutes)

app.listen(port, () => {
  console.log(`Server is running to port ${port}`);
});
