var express = require("express")
var router = express.Router();
const{carpenters_create,carpenters_update, carpenters_delete, carpenters_viewdata,carpenterlist, carpenters_listdata,carpentersdetails_searchdata}=require('../controller/carpenter.controller')
const{validate}=require('../../constant/validate');
const { verifytoken, allowRoles } = require("../middlware/auth");

router.post('/carpenter/data/create',verifytoken, allowRoles('admin'),validate('carpentercreate'),carpenters_create)

router.put('/carpenter/data/update/:id',verifytoken, allowRoles('admin'),validate('carpenterupdate'),carpenters_update)

router.delete('/carpenter/data/delete/:id',verifytoken, allowRoles('admin'),carpenters_delete)

router.get('/carpenter/viewdata/:id',verifytoken, allowRoles('admin'),carpenters_viewdata)

router.get('/carpenter/listdata/:id',verifytoken, allowRoles('admin'),carpenters_listdata)

router.get('/carpenter/list',verifytoken, allowRoles('admin'),carpenterlist)

router.get('/carpenter/searchdata',verifytoken, allowRoles('admin'),carpentersdetails_searchdata)


module.exports = router;