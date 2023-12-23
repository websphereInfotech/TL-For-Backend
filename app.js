require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/mongodb");
const morgan = require("morgan");
var cors = require("cors");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "App", "views"));

const {
  loginRoute,
  shopRoute,
  architectureRoute,
  carpenterRoute,
  userRoute,
  salesPersonRouter,
  followRoutes,
  totalRoutes,
  viewRoutes,
} = require("./App/router/timberland.Routes");
var port = process.env.PORT || 3000;

app.use(cors({origin: '*', credentials: true}))
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB();

app.use("/api", loginRoute);
app.use("/api", shopRoute);
app.use("/api", architectureRoute);
app.use("/api", carpenterRoute);
app.use("/api", userRoute);
app.use("/api", salesPersonRouter);
app.use("/api", followRoutes);
app.use("/api", totalRoutes);
app.use("/api", viewRoutes);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, () => {
  console.log(`Server is running to port ${port}`);
});