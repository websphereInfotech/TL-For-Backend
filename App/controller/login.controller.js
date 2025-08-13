var login = require('../model/login.model')
var Token = require('../model/token.model')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

exports.login_page = async function (req, res) {
  try {
    const { login_id, password } = req.body;

    const loginIdFind = await login.findOne({ login_id });

    if (!loginIdFind) {
      return res.status(404).json({
        status: "Fail",
        message: "Enter valid loginid"
      });
    }

    if (loginIdFind.password !== password) {
      return res.status(404).json({
        status: "Fail",
        message: "Enter valid password"
      });
    }

    const payload = {
      id: loginIdFind._id,
      login_id: loginIdFind.login_id,
      role: loginIdFind.role || 'admin' // Default role fallback
    };

    const token = jwt.sign(payload, process.env.KEY, { expiresIn: '1d' });

    const tokenSave = new Token({
      id: loginIdFind._id,
      token: token
    });

    await tokenSave.save();

    return res.status(200).json({
      status: "Success",
      message: "Login successful",
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Fail",
      message: "Failed to login"
    });
  }
};

exports.create_marketing_user = async (req, res) => {
  try {
    console.log("wait a minute creating now")
    if (req.user.role !== 'admin') {
      return res.status(403).json({ status: "Fail", message: "Access denied" });
    }

    const { login_id, password } = req.body;

    const existing = await login.findOne({ login_id });
    if (existing) {
      return res.status(400).json({ status: "Fail", message: "Login ID already exists" });
    }

    const newUser = new login({
      login_id,
      password,
      mobileNo: password,
      role: 'marketing'
    });

    await newUser.save();

    return res.status(200).json({ status: "Success", message: "Marketing user created successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Fail", message: "Server error" });
  }
};

exports.get_all_marketing_users = async (req, res) => {
  try {

    console.log("working")
    const marketingUsers = await login.find({ role: 'marketing' });

    return res.status(200).json({ status: "Success", data: marketingUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Fail", message: "Server error" });
  }
};

exports.get_marketing_user_by_id = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await login.findOne({ _id: id, role: 'marketing' });

    if (!user) {
      return res.status(404).json({ status: "Fail", message: "Marketing user not found" });
    }

    return res.status(200).json({ status: "Success", data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Fail", message: "Server error" });
  }
};

exports.update_marketing_user_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (id !== req.user) {
      return res.status(404).json({ status: "Fail", message: "Can't Update Other User Details" });
    }


    const user = await login.findOne({ _id: id, role: 'marketing' });

    if (!user) {
      return res.status(404).json({ status: "Fail", message: "Marketing user not found" });
    }

    const updatedUser = await login.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ status: "Success", data: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "Fail", message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, reEnterPassword } = req.body;
        const userId = req.user.id; // from verifytoken

        // 1️⃣ Check if all fields are provided
        if (!oldPassword || !newPassword || !reEnterPassword) {
            return res.status(400).json({ status: 'fail', message: 'All fields are required' });
        }

        // 2️⃣ Get user details
        const user = await login.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }
        
        // 4️⃣ Check if new password matches re-enter password
        if (newPassword !== reEnterPassword) {
            return res.status(400).json({ status: 'fail', message: 'New passwords do not match' });
        }
        if (oldPassword !== user.password) {
            return res.status(400).json({ status: 'fail', message: 'Old password is incorrect' });
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({ status: 'success', message: 'Password changed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
};









