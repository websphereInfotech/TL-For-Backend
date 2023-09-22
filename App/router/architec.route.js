var express = require("express")
var router = express.Router();
const{architec_create,architec_update,architec_delete,architec_viewdata,architec_listdata}=require('../controller/architec')
// const{login_validation}=require('../middlware/validation')

router.post('/architec-data-create',architec_create)

router.put('/architec-data-update/:id',architec_update)

router.delete('/architec-data-delete/:id',architec_delete)

router.get('/architec-viewdata/:id',architec_viewdata)

router.get('/architec-listdata',architec_listdata)

module.exports = router;