var express = require("express")
var router = express.Router();
const{shopdetails_create,shopdetails_update,shopdetails_delete,shopdetails_viewdata,shopdetails_listdata,shopsdetails_searchdata}=require('../controller/shop.controller')
const{validate}=require('../../constant/validate')
const {verifytoken}=require('../middlware/auth')

router.post('/shop/data/create',verifytoken,validate('shopcreate'),shopdetails_create)

router.put('/shop/data/update/:id',verifytoken,validate('shopupdate'),shopdetails_update)

router.delete('/shop/data/delete/:id',verifytoken,shopdetails_delete)

router.get('/shop/viewdata/:id',verifytoken,shopdetails_viewdata)

router.get('/shop/listdata/:id',verifytoken,shopdetails_listdata)

router.get('/shop/searchdata',verifytoken,shopsdetails_searchdata)


module.exports = router;