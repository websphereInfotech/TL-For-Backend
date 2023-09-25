var architec= require('../model/architec.model')
var jwt = require('jsonwebtoken');

exports.architec_create = async function(req,res){
    try {
        const { architecsName,mobileNo,Address } = req.body;
        // const architacecreateData = await architec.findOne({ architecsName })
        // if (architacecreateData ) {
        //     return res.status(400).json({
        //         status:"Fail",
        //         message:"architecsName already exist"
        //     })
        // }
        const architecmobilno = await architec.findOne({ mobileNo })
        if(architecmobilno)
        {
            return res.status(400).json({
                status:"Fail",
                message:"mobileno already exist"
            })
        }
        const architecData = await architec.create({
            architecsName:architecsName,
            mobileNo:mobileNo,
            Address:Address
        })
        const payload = {
           id:architecData._id,
           architecsName:architecsName,
           mobileNo:mobileNo,
           Address:Address
        };
        let token = jwt.sign(payload, process.env.KEY, { expiresIn: '1h' })

        res.status(200).json({
            status: "Success",
            message: "create architecData",
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
        const { architecsName,mobileNo,Address } = req.body;
        const updatearchitecdata = {
            architecsName: architecsName,
            mobileNo: mobileNo,
            Address:Address
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
            message: "updated data",
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
            message: "user Fetch sucessfully",
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
        // if(!listdata)
        // {
        //     return res.status(400).json({
        //         status:"Fail",
        //         message:"fail to get data"
        //     })
        // }
        res.status(200).json({
            status: "Success",
            message: "get all data",
            data: listdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}