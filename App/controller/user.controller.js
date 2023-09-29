var jwt = require('jsonwebtoken');
const user = require('../model/user.model');


exports.userdetails_create = async function (req, res) {
    try {
        const { userName, mobileNo, address, serialNumber,rate,description,quantity,architecture_id, carpenter_id, shop_id } = req.body;
        const userdata = await user.findOne({ mobileNo })
        if (userdata) {
            return res.status(400).json({
                status: "Fail",
                message: "User Name Already Exist"
            })
        }
        const usermobileNo = await user.findOne({ mobileNo })
        if (usermobileNo) {
            return res.status(400).json({
                status: "Fail",
                message: "Mobile Number already exist"
            })
        }
        const userData = await user.create({
            userName,
            mobileNo,
            address,
            serialNumber,
            rate,
            description,
            quantity,
            architecture_id,
            carpenter_id,
            shop_id
        })
        const payload = {
            id: userData._id,
            userName: userName,
            mobileNo: mobileNo,
            address: address,
            serialNumber:serialNumber,
            rate:rate,
            description:description,
            quantity:quantity,
            architectureId: architecture_id,
            carpenterId: carpenter_id,
            shopId: shop_id
        };
        let token = jwt.sign(payload, process.env.KEY, { expiresIn: '1d' })
        res.status(200).json({
            status: "Success",
            message: "create userdata",
            data: userData,
            token: token
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}
//==============================================================UPDATE DATA============================================================
exports.userdetails_update = async function (req, res) {
    try {
        const { userName, mobileNo, address,serialNumber,rate,description,quantity,architecture_id, carpenter_id, shop_id } = req.body;
        const updateuserdata = {
            userName: userName,
            mobileNo: mobileNo,
            address: address,
            serialNumber:serialNumber,
            rate:rate,
            description:description,
            quantity:quantity,
            architecture_id: architecture_id,
            carpenter_id: carpenter_id,
            shop_id: shop_id
        }
        const userdata = await user.findByIdAndUpdate({ "_id": req.params.id }, { $set: updateuserdata }, { new: true })
        if (!userdata) {
            return res.status(400).json({
                status: "Fail",
                message: "user not found"
            })
        }
        res.status(200).json({
            status: "Success",
            message: "updated data",
            data: userdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: "user not found"
        })
    }
}
// //===============================================================DELETE DATA====================================================================
exports.userdetails_delete = async function (req, res) {
    try {
        const userdatadelete = await user.findByIdAndDelete({ "_id": req.params.id });
        if (!userdatadelete) {
            return res.status(400).json({
                status: "Fail",
                message: "user not found"
            })
        }
        res.status(200).json({
            status: "Sucess",
            message: "user delete sucessfully"
        })

    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: "user not found"
        })
    }
}
// //========================================================================VIEW DATA=========================================================
exports.userdetails_viewdata = async function (req, res) {
    try {
        const userviewdata = await user.findById({ "_id": req.params.id });
        if (!userviewdata) {
            return res.status(400).json({
                status: "Fail",
                message: "user not found"
            })
        }
        res.status(201).json({
            status: "Sucess",
            message: "user Fetch sucessfully",
            data: userviewdata
        });
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message

        })
    }
}
// //========================================================================LIST DATA=========================================================
exports.userdetails_listdata = async function (req, res) {
    try {
        const listdata = await user.find()
        var Datacount=listdata.length
        res.status(200).json({
            status: "Success",
            message: "get all data",
            count: Datacount,
            data: listdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}
//============================================================================SERCH DATA=========================================================
exports.userdetails_searchdata = async function (req, res) {
    try {
        const nameFeild=req.query.userName
        const searchdata = await user.find({userName:{$regex:nameFeild,$options: 'i' }})
        res.status(200).json({
            status: "Success",
            message: "fetch data successfully",
            data: searchdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}