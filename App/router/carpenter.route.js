var express = require("express")
var router = express.Router();
const{carpenters_create,carpenters_update, carpenters_delete, carpenters_viewdata, carpenters_listdata}=require('../controller/carpenter.controller')
const{validate}=require('../../constant/validate')

router.post('/carpenter/data/create',validate('carpentercreate'),carpenters_create)

router.put('/carpenter/data/update/:_id',validate('carpenterupdate'),carpenters_update)

router.delete('/carpenter/data/delete/:id',carpenters_delete)

router.get('/carpenter/viewdata/:id',carpenters_viewdata)

router.get('/carpenter/listdata',carpenters_listdata)

module.exports = router;