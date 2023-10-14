var express = require("express");
var router = express.Router();
const { validate } = require("../../constant/validate");
const { verifytoken } = require("../middlware/auth");
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
router.post("/salesPerson/create", verifytoken, validate("salesPersonCreate"), personCreate );

//update
router.put("/salesPerson/update/:id", verifytoken, validate("salesPersonCreate"), personUpdate );

//delete
router.delete("/salesPerson/delete/:id", verifytoken, PersonDelete);

//view
router.get("/salesPerson/view/:id", verifytoken, salesPersonView);

// search
router.get("/salesPerson/search", verifytoken, salesPersonSearch);

// list Date wise
router.get("/salesPerson/salespersonid/:id", verifytoken, salesPersonList);

// PersonListData
router.get("/salesPerson/AllList", verifytoken, salesPersonListData);

// salesPersonListData
router.get("/salesPersonListWithUser/:id", verifytoken , salesPersonListWithUser);

module.exports = router;
