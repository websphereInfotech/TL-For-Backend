var express = require("express")
var router = express.Router();
const {
  quotation_create,
  quotation_update,
  quotation_delete,
  quotation_view,
  quotation_list,
  quotation_search,
} = require("../controller/quotation.controller");
const{validate}=require('../../constant/validate');
const { verifytoken } = require("../middlware/auth");


router.post("/quotation/cerate", verifytoken, validate("usercreate"), quotation_create);

router.put("/quotation/update/:id",verifytoken,validate("userupdate"),quotation_update);

router.delete('/quotation/delete/data/:id',verifytoken,quotation_delete)

router.get('/quotation/viewdata/:id',verifytoken,quotation_view)

router.get('/quotation/listdata',verifytoken,quotation_list)

router.get('/quotation/searchdata',verifytoken,quotation_search)


module.exports = router;