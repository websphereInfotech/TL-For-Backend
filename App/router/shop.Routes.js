var express = require("express")
var router = express.Router();
const{shopdetails_create,shopdetails_update,shopdetails_delete,shopdetails_viewdata,shopdetails_listdata,shoplist,shopsdetails_searchdata}=require('../controller/shop.controller')
const{validate}=require('../../constant/validate')
const {verifytoken, allowRoles}=require('../middlware/auth')

router.post('/shop/data/create',verifytoken, allowRoles('admin'),validate('shopcreate'),shopdetails_create)

router.put('/shop/data/update/:id',verifytoken, allowRoles('admin'),validate('shopupdate'),shopdetails_update)

router.delete('/shop/data/delete/:id',verifytoken, allowRoles('admin'),shopdetails_delete)

router.get('/shop/viewdata/:id',verifytoken, allowRoles('admin'),shopdetails_viewdata)

router.get('/shop/listdata/:id',verifytoken, allowRoles('admin'),shopdetails_listdata)

router.get('/shop/list',verifytoken, allowRoles('admin'),shoplist)

router.get('/shop/searchdata',verifytoken, allowRoles('admin'),shopsdetails_searchdata)



module.exports = router;