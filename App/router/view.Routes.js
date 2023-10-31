var express = require("express");
var router = express.Router();
const { AllFiles, createExcel } = require("../controller/view.controller");

const { verifytoken } = require("../middlware/auth");

router.get("/quatation/pdf/:id", AllFiles);

router.get("/excel/:id", createExcel);

module.exports = router;
