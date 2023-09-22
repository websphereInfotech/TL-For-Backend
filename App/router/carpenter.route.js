var express = require("express")
var router = express.Router();
const{carpenters_create,carpenters_update, carpenters_delete, carpenters_viewdata, carpenters_listdata}=require('../controller/carpenter')
const{carpentervalidation}=require('../middlware/validation')

router.post('/carpenter-data-create',carpenters_create)

router.put('/carpenter-data-update/:id',carpenters_update)

router.delete('/carpenter-data-delete/:id',carpenters_delete)

router.get('/carpenter-viewdata/:id',carpenters_viewdata)

router.get('/carpenter-listdata',carpentervalidation,carpenters_listdata)

module.exports = router;