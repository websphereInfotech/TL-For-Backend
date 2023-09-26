var express = require("express")
var router = express.Router();
const{architec_create,architec_update,architec_delete,architec_viewdata,architec_listdata,architecdetails_searchdata}=require('../controller/architecture.controller')
const{validate}=require('../../constant/validate');
const { verifytoken } = require("../middlware/auth");

router.post('/architec/data/create',verifytoken,validate('architacecreate'),architec_create)

router.put('/architec/data/update/:id',verifytoken,validate('architaceupdate'),architec_update)

router.delete('/architec/data/delete/:id',verifytoken,architec_delete)

router.get('/architec/viewdata/:id',verifytoken,architec_viewdata)

router.get('/architec/listdata',verifytoken,architec_listdata)

router.get('/architec/searchdata',verifytoken,architecdetails_searchdata)


module.exports = router;