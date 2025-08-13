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
const { verifytoken, allowRoles } = require("../middlware/auth");


router.post("/quotation/cerate", verifytoken,  allowRoles('admin'),validate("usercreate"), quotation_create);

router.put("/quotation/update/:id",verifytoken, allowRoles('admin'),validate("userupdate"),quotation_update);

router.delete('/quotation/delete/data/:id',verifytoken ,allowRoles('admin'),quotation_delete)

router.get('/quotation/viewdata/:id',verifytoken, allowRoles('admin'),quotation_view)

router.get('/quotation/listdata',verifytoken, allowRoles('admin'),quotation_list)

router.get('/quotation/searchdata',verifytoken, allowRoles('admin'),quotation_search)


module.exports = router;