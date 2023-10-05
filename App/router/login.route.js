var express = require("express")
var router = express.Router();
const{login_page}=require('../controller/login.controller')
const{validate}=require('../../constant/validate');

router.post('/login',validate('login'),login_page)

module.exports = router;