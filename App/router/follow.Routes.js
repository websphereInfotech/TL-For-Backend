var express = require("express");
var router = express.Router();
const { verifytoken , allowRoles} = require("../middlware/auth");
const { approve, Reject } = require("../controller/follw.controller");

router.post("/follow/approve/:id", verifytoken ,  allowRoles('admin'),approve);

router.post("/follow/reject/:id", verifytoken , allowRoles('admin'), Reject);

module.exports = router