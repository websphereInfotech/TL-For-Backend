var express = require("express");
var router = express.Router();
const { create_marketing, get_marketing_by_login_id, get_marketing_by_id, get_marketing_by_login_id_excel, get_marketing_by_address } = require("../controller/marketing.controller");
const { validate } = require("../../constant/validate");
const { allowRoles } = require("../middlware/auth");
const { verifytoken } = require("../middlware/auth");



router.post("/marketing/create",  verifytoken, allowRoles('marketing'), create_marketing);
router.get("/marketing/list/:id",  verifytoken, get_marketing_by_login_id);
router.get("/marketing/excel/:id",  verifytoken, get_marketing_by_login_id_excel);
router.get("/marketing/view/:id",  verifytoken, get_marketing_by_id);
router.post("/marketing/view/adress",  verifytoken, get_marketing_by_address);
// router.get("/marketingPerson/getAll", verifytoken, get_all_marketing_users);
// router.get("/marketingPerson/view/:id", verifytoken, get_marketing_user_by_id);
// router.put("/marketingPerson/update/:id", verifytoken, update_marketing_user_by_id);

module.exports = router;
