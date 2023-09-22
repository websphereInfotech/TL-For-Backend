var express = require("express")
var router = express.Router();
const{Login_page}=require('../controller/login')
const{login_validation}=require('../middlware/validation')

router.post('/login',login_validation,Login_page)

module.exports = router;