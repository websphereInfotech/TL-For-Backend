const loginRoute = require("./login.Routes");
const shopRoute = require("./shop.Routes");
const architectureRoute = require("./architec.Routes");
const carpenterRoute = require("./carpenter.Routes");
const userRoute = require("./quotation.Routes");
const salesPersonRouter = require("./salesPerson.Routes");
const followRoutes = require("./follow.Routes");
const totalRoutes = require("./total.Routes");
const viewRoutes = require("../router/view.Routes");
const marketingRoutes = require("../router/marketing.Routs")
module.exports = {
  loginRoute,
  shopRoute,
  architectureRoute,
  carpenterRoute,
  userRoute,
  salesPersonRouter,
  followRoutes,
  totalRoutes,
  viewRoutes,
  marketingRoutes
};
