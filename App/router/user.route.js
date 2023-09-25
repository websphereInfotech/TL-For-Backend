var express = require("express")
var router = express.Router();
const{userdetails_create,userdetails_update,userdetails_delete,userdetails_viewdata,userdetails_listdata}=require('../controller/user.controller')
const{validate}=require('../../constant/validate')

router.post('/quotation/cerate',validate('usercreate'),userdetails_create)

router.put('/quotation/update/:id',validate('userupdate'),userdetails_update)

router.delete('/quotation/delete/data/:id',userdetails_delete)

router.get('/quotation/viewdata/:id',userdetails_viewdata)

router.get('/quotation/listdata',userdetails_listdata)

module.exports = router;