const {
  carpenter_Name,
  shopsName,
  arcitecsname,
  mobileNo,
  address,
  userName,
  serialNumber,
  password,
  login_id,
  totalcreate,
} = require("../App/middlware/validation");
exports.validate = function (method) {
  switch (method) {
    case "carpentercreate":
      return [carpenter_Name, mobileNo];
    case "carpenterupdate":
      return [carpenter_Name, mobileNo];
    case "architacecreate":
      return [arcitecsname, mobileNo];
    case "architaceupdate":
      return [arcitecsname, mobileNo];
    case "shopcreate":
      return [shopsName, mobileNo];
    case "shopupdate":
      return [shopsName, mobileNo];
    case "usercreate":
      return [userName, mobileNo, address, serialNumber];
    case "userupdate":
      return [userName, mobileNo, address];
    case "login":
      return [login_id, password];
    case "salesPersonCreate":
      return [mobileNo];
    case "totalcreate":
      return [totalcreate];
  }
};
