var shops = require('../model/shop.model')
var jwt = require('jsonwebtoken');


exports.shopdetails_create = async function (req, res) {
    try {
        const { shopName, mobileNo, address } = req.body;
    
        const shopmobileno = await shops.findOne({ mobileNo })
        if (shopmobileno) {
            return res.status(400).json({
                status: "Fail",
                message: "mobilN0 already exist"
            })
        }
        const shopData = await shops.create({
            shopName: shopName,
            mobileNo: mobileNo,
            address: address

        })
        const payload = {
            id: shopData._id,
            shopName: shopName,
            mobileNo: mobileNo,
            address: address
        };
        let token = jwt.sign(payload, process.env.KEY, { expiresIn: '1d' })

        res.status(200).json({
            status: "Success",
            message: "create userdata",
            data: shopData,
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
exports.shopdetails_update = async function (req, res, next) {
    try {
        const { shopName, mobileNo, address } = req.body;
        const updateshopdata = {
            shopName: shopName,
            mobileNo: mobileNo,
            ddress: address
        }
        
        const shopdata = await shops.findByIdAndUpdate({ "_id": req.params.id }, { $set: updateshopdata }, { new: true })
        if (!shopdata) {
            return res.status(400).json({
                status:"Fail",
                message:"user not found"
            })
        }
        res.status(200).json({
            status: "Success",
            message: "updated data",
            data: shopdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: "user not found"
        })
    }
    next();
}
//===============================================================DELETE DATA====================================================================
exports.shopdetails_delete = async function (req, res) {
    try {
        const shopdatadelete = await shops.findByIdAndDelete({ "_id": req.params.id });
        if (!shopdatadelete) {
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
exports.shopdetails_viewdata = async function (req, res) {
    try {
        const shopviewdata = await shops.findById({ "_id": req.params.id });
        if (!shopviewdata) {
            return res.status(401).json({
                status: "Fail",
                message: "user not found"
            })
        }
        res.status(201).json({
            status: "Sucess",
            message: "user Fetch sucessfully",
            data: shopviewdata
        });
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message

        })
    }
}
//========================================================================LIST DATA=========================================================
exports.shopdetails_listdata = async function (req, res) {
    try {
        const listdata = await shops.find()
        var Datacount=listdata.length
        res.status(200).json({
            status: "Success",
            message: "get all data",
            count:Datacount,
            data: listdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}
//================================================================SHOP SEARCH DATA==========================================================
exports.shopsdetails_searchdata = async function (req, res) {
    try {
        const nameField=req.query.shopName
        const searchdata = await shops.find({shopName:{$regex:nameField,$options: 'i' }})
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