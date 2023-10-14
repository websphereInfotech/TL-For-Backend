var express = require("express");
var router = express.Router();
const { AllFiles } = require("../controller/view.controller");

const { verifytoken } = require("../middlware/auth");

router.get("/quatation/pdf/:id", AllFiles);

module.exports = router;
