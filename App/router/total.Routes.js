var express = require("express")
var router = express.Router();
const { totalCreate, totalupdate, totalView, totalDelete } = require('../controller/total.controller')
const { validate } = require("../../constant/validate");
const {verifytoken}=require('../middlware/auth')

router.post("/total/create", verifytoken, validate("totalcreate"), totalCreate);

router.put("/total/update/:id", verifytoken, totalupdate);

router.get("/total/view/:id", verifytoken, totalView);

router.delete("/total/delete/:id", verifytoken, totalDelete);

module.exports = router