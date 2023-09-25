var express = require("express")
var router = express.Router();
const{Login_page}=require('../controller/login.controller')
const{loginValidation}=require('../middlware/validation')

router.post('/login',loginValidation,Login_page)

module.exports = router;