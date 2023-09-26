var express = require("express")
var router = express.Router();
const{login_page}=require('../controller/login.controller')
const{loginValidation}=require('../middlware/validation');

router.post('/login',loginValidation,login_page)

module.exports = router;