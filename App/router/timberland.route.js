const loginRoute = require("./login.route");
const shopRoute = require("./shop.route");
const architectureRoute = require("./architec.route");
const carpenterRoute = require("./carpenter.route");
const userRoute = require("./user.route");
const salesPersonRouter = require('./salesPerson.Routes')
const followRoutes =require('./follow.Routes')
module.exports = {
  loginRoute,
  shopRoute,
  architectureRoute,
  carpenterRoute,
  userRoute,
  salesPersonRouter,
  followRoutes
};
