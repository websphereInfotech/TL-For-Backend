var Marketing = require('../model/marketing.model')

const Login = require("../model/login.model"); // Assuming this is your login model
const excelJs = require("exceljs");


exports.create_marketing = async (req, res) => {
  try {
    const {
      date,
      name,
      mobileNo,
      address,
      addressTwo,
      nextEmergingDate,
      remark
    } = req.body;

    const loginId = req.user.id;

    const newMarketing = new Marketing({
      date: date ? new Date(date) : undefined,
      login_id: loginId,
      name: String(name),
      mobileNo: Number(mobileNo),
      address: String(address),
      addressTwo: addressTwo ? String(addressTwo) : undefined,
      nextEmergingDate: nextEmergingDate ? new Date(nextEmergingDate) : undefined,
      remark: remark ? String(remark) : undefined,
    });

    await newMarketing.save();

    res.status(201).json({ status: 'Success', data: newMarketing });
  } catch (err) {
    console.error(err);

    // Handle duplicate key error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.address) {
      return res.status(400).json({
        status: 'Fail',
        message: 'Duplicate address is not allowed'
      });
    }

    res.status(500).json({ status: 'Fail', message: 'Server Error' });
  }
};

exports.get_marketing_by_login_id = async (req, res) => {
  try {
    const { id } = req.params; // login_id from route params
    const { startDate, endDate } = req.query; // date range from query params

    // Build filter object
    let filter = { login_id: id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }

    const marketingList = await Marketing.find(filter);

    if (!marketingList || marketingList.length === 0) {
      return res.status(404).json({
        status: 'Fail',
        message: 'No marketing records found for this login_id in given date range',
      });
    }

    res.status(200).json({
      status: 'Success',
      data: marketingList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'Fail',
      message: 'Server Error',
    });
  }
};

exports.get_marketing_by_id = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch marketing entry by ID
    const marketing = await Marketing.findById(id);

    if (!marketing) {
      return res.status(404).json({
        status: 'Fail',
        message: 'Marketing record not found',
      });
    }

    res.status(200).json({
      status: 'Success',
      data: marketing,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'Fail',
      message: 'Server Error',
    });
  }
};

exports.get_marketing_by_login_id_excel = async (req, res) => {
  try {
    console.log("running")
    const { id } = req.params; // login_id from route params
    const { startDate, endDate } = req.query; // date range from query params

    let filter = { login_id: id };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }

    const marketingList = await Marketing.find(filter);

    if (!marketingList || marketingList.length === 0) {
      return res.status(404).json({
        status: 'Fail',
        message: 'No marketing records found for this login_id in given date range',
      });
    }
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Marketing Data");

    worksheet.columns = [
      { header: "Date", key: "date" },
      { header: "Name", key: "name" },
      { header: "Mobile No", key: "mobileNo" },
      { header: "Address", key: "address" },
      { header: "Address 2", key: "addressTwo" },
      { header: "Next Emerging Date", key: "nextEmergingDate" },
      { header: "Remark", key: "remark" }
    ];

    worksheet.columns.forEach((column) => {
      column.alignment = { horizontal: "center" };
      column.width = 20;
    });

    marketingList.forEach((item) => {
      worksheet.addRow({
        date: item.date ? new Date(item.date).toLocaleDateString("en-IN") : "",
        name: item.name,
        mobileNo: item.mobileNo,
        address: item.address,
        addressTwo: item.addressTwo,
        nextEmergingDate: item.nextEmergingDate
          ? new Date(item.nextEmergingDate).toLocaleDateString("en-IN")
          : "",
        remark: item.remark
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=marketing_data.xlsx"
    );

    // Stream directly to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({
        status: 'Fail',
        message: 'Server Error',
      });
    }
  }
};


exports.get_marketing_by_address = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        status: "Fail",
        message: "Address is required",
      });
    }

    // Step 1: Find first marketing record by address (case-insensitive)
    const marketingData = await Marketing.findOne({
      address: { $regex: new RegExp("^" + address.trim() + "$", "i") }
    });

    if (!marketingData) {
      return res.status(404).json({
        status: "Fail",
        message: "No marketing record found for this address",
      });
    }

    // Step 2: Find the login user linked to the marketing record
    const loginData = await Login.findById(marketingData.login_id);

    if (!loginData) {
      return res.status(404).json({
        status: "Fail",
        message: "Linked login user not found",
      });
    }

    // Step 3: Return both
    res.status(200).json({
      status: "Success",
      marketing: marketingData,
      login: loginData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Fail",
      message: "Server Error",
    });
  }
};



