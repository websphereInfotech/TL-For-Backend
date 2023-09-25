var express = require("express")
var router = express.Router();
const{shopdetails_create,shopdetails_update,shopdetails_delete,shopdetails_viewdata,shopdetails_listdata}=require('../controller/shop.controller')
const{validate}=require('../../constant/validate')

router.post('/shop/data/create',validate('shopcreate'),shopdetails_create)

router.put('/shop/data/update/:id',validate('shopupdate'),shopdetails_update)

router.delete('/shop/data/delete/:id',shopdetails_delete)

router.get('/shop/viewdata/:id',shopdetails_viewdata)

router.get('/shop/listdata',shopdetails_listdata)

module.exports = router;