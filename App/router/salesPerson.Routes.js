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
router.post("/salesPerson/data/create", verifytoken, validate("salesPersonCreate"), personCreate );

//update
router.put("/salesPerson/data/update/:id", verifytoken, validate("salesPersonCreate"), personUpdate );

//delete
router.delete("/salesPerson/data/delete/:id", verifytoken, PersonDelete);

//view
router.get("/salesPerson/data/view/:id", verifytoken, salesPersonView);

// search
router.get("/salesPerson/data/search", verifytoken, salesPersonSearch);

// list Date wise
router.get("/salesPerson/data/list", verifytoken, salesPersonList);

// PersonListData
router.get("/salesPerson/data", verifytoken, salesPersonListData);

module.exports = router;
