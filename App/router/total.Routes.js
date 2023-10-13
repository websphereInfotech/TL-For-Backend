var express = require("express")
var router = express.Router();
const { totalCreate } = require('../controller/total.controller')
const {verifytoken}=require('../middlware/auth')

router.post("/total/create", verifytoken, totalCreate);

module.exports = router