var express = require("express")
var router = express.Router();
const{userdetails_create,userdetails_update,userdetails_delete,userdetails_viewdata,userdetails_listdata,userdetails_searchdata}=require('../controller/user.controller')
const{validate}=require('../../constant/validate');
const { verifytoken } = require("../middlware/auth");


router.post('/quotation/cerate',verifytoken,validate('usercreate'),userdetails_create)

router.put('/quotation/update/:id',verifytoken,validate('userupdate'),userdetails_update)

router.delete('/quotation/delete/data/:id',verifytoken,userdetails_delete)

router.get('/quotation/viewdata/:id',verifytoken,userdetails_viewdata)

router.get('/quotation/listdata',verifytoken,userdetails_listdata)

router.get('/quotation/searchdata',verifytoken,userdetails_searchdata)


module.exports = router;