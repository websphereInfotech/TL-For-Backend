var express = require("express");
var router = express.Router();
const { login_page, changePassword, create_marketing_user, get_all_marketing_users, get_marketing_user_by_id, update_marketing_user_by_id } = require("../controller/login.controller");
const { validate } = require("../../constant/validate");
const { allowRoles } = require("../middlware/auth");
const { verifytoken } = require("../middlware/auth");



router.post('/Login', validate('login'), login_page)
router.post('/auth/changePassword',verifytoken, changePassword)
router.post("/marketingPerson/create",  verifytoken, allowRoles('admin'), create_marketing_user);
router.get("/marketingPerson/getAll", verifytoken, get_all_marketing_users);
router.get("/marketingPerson/view/:id", verifytoken, get_marketing_user_by_id);
router.put("/marketingPerson/update/:id", verifytoken, allowRoles('admin'), update_marketing_user_by_id);

module.exports = router;
