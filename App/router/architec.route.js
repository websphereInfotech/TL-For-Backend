var express = require("express")
var router = express.Router();
const{architec_create,architec_update,architec_delete,architec_viewdata,architec_listdata}=require('../controller/architecture.controller')
const{validate}=require('../../constant/validate')

router.post('/architec/data/create',validate('architacecreate'),architec_create)

router.put('/architec/data/update/:id',validate('architaceupdate'),architec_update)

router.delete('/architec/data/delete/:id',architec_delete)

router.get('/architec/viewdata/:id',architec_viewdata)

router.get('/architec/listdata',architec_listdata)

module.exports = router;