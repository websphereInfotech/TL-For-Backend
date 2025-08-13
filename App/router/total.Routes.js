var express = require("express")
var router = express.Router();
const { totalCreate, totalupdate, totalView, totalDelete } = require('../controller/total.controller')
const { validate,  } = require("../../constant/validate");
const {verifytoken, allowRoles}=require('../middlware/auth')

router.post("/total/create", verifytoken, allowRoles('admin'), validate("totalcreate"), totalCreate);

router.put("/total/update/:id", verifytoken, allowRoles('admin'), totalupdate);

router.get("/total/view/:id", verifytoken,  allowRoles('admin'),totalView);

router.delete("/total/delete/:id", verifytoken, allowRoles('admin'), totalDelete);

module.exports = router