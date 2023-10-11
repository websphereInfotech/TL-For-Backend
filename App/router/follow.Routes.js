var express = require("express");
var router = express.Router();
const { verifytoken } = require("../middlware/auth");
const { approve, Reject } = require("../controller/follw.controller");

router.post("/follow/approve/:id", verifytoken , approve);

router.post("/follow/reject/:id", verifytoken , Reject);

module.exports = router