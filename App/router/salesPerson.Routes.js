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
} = require("../controller/salesPerson.controllar");

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
router.get("/salesPerson/list", verifytoken, salesPersonList);

// PersonListData
router.get("/salesPerson/AllList", verifytoken, salesPersonListData);

module.exports = router;
