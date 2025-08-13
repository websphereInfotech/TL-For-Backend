var express = require("express");
var router = express.Router();
const { validate } = require("../../constant/validate");
const { verifytoken, allowRoles } = require("../middlware/auth");
const {
  personCreate,
  personUpdate,
  PersonDelete,
  salesPersonView,
  salesPersonSearch,
  salesPersonList,
  salesPersonListData,
  salesPersonListWithUser,
} = require("../controller/salesPerson.controller");

//craete
router.post("/salesPerson/create", verifytoken, allowRoles('admin'), validate("salesPersonCreate"), personCreate );

//update
router.put("/salesPerson/update/:id", verifytoken,  allowRoles('admin'),validate("salesPersonCreate"), personUpdate );

//delete
router.delete("/salesPerson/delete/:id", verifytoken, allowRoles('admin'), PersonDelete);

//view
router.get("/salesPerson/view/:id", verifytoken,  allowRoles('admin'),salesPersonView);

// search
router.get("/salesPerson/search", verifytoken,  allowRoles('admin'),salesPersonSearch);

// list Date wise
router.get("/salesPerson/salespersonid/:id", verifytoken, allowRoles('admin'), salesPersonList);

// PersonListData
router.get("/salesPerson/AllList", verifytoken,  allowRoles('admin'),salesPersonListData);

// salesPersonListData
router.get("/salesPersonListWithUser/:id", verifytoken ,  allowRoles('admin'),salesPersonListWithUser);

module.exports = router;
