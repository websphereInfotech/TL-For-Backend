var express = require("express")
var router = express.Router();
const { totalCreate, totalupdate } = require('../controller/total.controller')
const {verifytoken}=require('../middlware/auth')

router.post("/total/create", verifytoken, totalCreate);

router.put("/total/update/:id", verifytoken, totalupdate);

module.exports = router