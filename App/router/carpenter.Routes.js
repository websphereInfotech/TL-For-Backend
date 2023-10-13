var express = require("express")
var router = express.Router();
const{carpenters_create,carpenters_update, carpenters_delete, carpenters_viewdata,carpenterlist, carpenters_listdata,carpentersdetails_searchdata}=require('../controller/carpenter.controller')
const{validate}=require('../../constant/validate');
const { verifytoken } = require("../middlware/auth");

router.post('/carpenter/data/create',verifytoken,validate('carpentercreate'),carpenters_create)

router.put('/carpenter/data/update/:id',verifytoken,validate('carpenterupdate'),carpenters_update)

router.delete('/carpenter/data/delete/:id',verifytoken,carpenters_delete)

router.get('/carpenter/viewdata/:id',verifytoken,carpenters_viewdata)

router.get('/carpenter/listdata/:id',verifytoken,carpenters_listdata)

router.get('/carpenter/list',verifytoken,carpenterlist)

router.get('/carpenter/searchdata',verifytoken,carpentersdetails_searchdata)


module.exports = router;