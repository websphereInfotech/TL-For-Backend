var architec = require('../model/architec.model')
var jwt = require('jsonwebtoken');

exports.architec_create = async function (req, res) {
    try {
        const { architecsName, mobileNo, address } = req.body;
        const architecmobilno = await architec.findOne({ mobileNo })
        if (architecmobilno) {
            return res.status(400).json({
                status: "Fail",
                message: "Mobile Number Already Exist"
            })
        }
        const architecData = await architec.create({
            architecsName: architecsName,
            mobileNo: mobileNo,
            address: address
        })
        const payload = {
            id: architecData._id,
            architecsName: architecsName,
            mobileNo: mobileNo,
            address: address
        };
        let token = jwt.sign(payload, process.env.KEY, { expiresIn: '1d' })

        res.status(200).json({
            status: "Success",
            message: " Architectures Create Successfully",
            data: architecData,
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
exports.architec_update = async function (req, res, next) {
    try {
        const { architecsName, mobileNo, address } = req.body;
        const updatearchitecdata = {
            architecsName: architecsName,
            mobileNo: mobileNo,
            address: address
        }
        const architecdata = await architec.findByIdAndUpdate({ "_id": req.params.id }, { $set: updatearchitecdata }, { new: true })
        if (!architecdata) {
            return res.status(400).json({
                status: "Fail",
                message: "user not found"
            })
        }
        res.status(200).json({
            status: "Success",
            message: "Architecture update Successfully",
            data: architecdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: "user not found"
        })
    }
}
//===============================================================DELETE DATA====================================================================
exports.architec_delete = async function (req, res) {
    try {
        const architecdatadelete = await architec.findByIdAndDelete({ "_id": req.params.id });
        if (!architecdatadelete) {
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
//========================================================================VIEW DATA=========================================================
exports.architec_viewdata = async function (req, res) {
    try {
        const architecviewdata = await architec.findById({ "_id": req.params.id });
        if (!architecviewdata) {
            return res.status(401).json({
                status: "Fail",
                message: "user not found"
            })
        }
        res.status(201).json({
            status: "Sucess",
            message: "Architecture Fetch Sucessfully",
            data: architecviewdata
        });
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: "user no fetch data"

        })
    }
}
//========================================================================LIST DATA=========================================================
exports.architec_listdata = async function (req, res) {
    try {
        const listdata = await architec.find()
        dataCount=listdata.length
        res.status(200).json({
            status: "Success",
            message: "get all data",
            count:dataCount,
            data: listdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}
//================================================================SEARCH DATA===================================================================
exports.architecdetails_searchdata = async function (req, res) {
    try {
        const name = req.query.architecName
        if (!name) {
            return res.status(400).json({
                status:"Fail",
                message:"architecsname is not found"
            })
        }
        const searchdata = await architec.find({architecsName: { $regex: name,$options:'i'} })
        res.status(200).json({
            status: "Success",
            message: "Architecture fetch successfully",
            data: searchdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}