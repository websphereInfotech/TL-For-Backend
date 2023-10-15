var express = require("express")
var router = express.Router();
const { totalCreate, totalupdate, totalView, totalDelete } = require('../controller/total.controller')
const {verifytoken}=require('../middlware/auth')

router.post("/total/create", verifytoken, totalCreate);

router.put("/total/update/:id", verifytoken, totalupdate);

router.get("/total/view/:id", verifytoken, totalView);

router.get("/total/delete/:id", verifytoken, totalDelete);

module.exports = router