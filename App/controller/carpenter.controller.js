const carpenter = require('../model/carpenter.model');
const user = require('../model/user.model')
var jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

exports.carpenters_create = async function(req,res){
    try {
        const { carpentersName,mobileNo,address } = req.body;
        const checkmobilno = await carpenter.findOne({ mobileNo })
        if ( checkmobilno ) {
            return res.status(400).json({
                status:"Fail",
                message:"Mobile Number Already Exist"
            })
        }
        const carpenterData = await carpenter.create({
            carpentersName:carpentersName,
            mobileNo:mobileNo,
            address:address
        })
        const payload = {
           id: carpenterData.id,
           carpentersName:carpentersName,
           mobileNo:mobileNo,
           address:address
        };
        let token = jwt.sign(payload, process.env.KEY, { expiresIn: '1d' })

        res.status(200).json({
            status: "Success",
            message: "Carpenter Create Successfully",
            data: carpenterData,
            token: token
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message
        })
    }
}
// //==============================================================UPDATE DATA============================================================
exports.carpenters_update = async function (req, res) {
    try {
        const {carpentersName,mobileNo,address } = req.body;
        const updatecarpenterdata = {
            carpentersName:carpentersName,
            mobileNo:mobileNo,
            address:address
        }
        const carpenterdetails=await carpenter.findByIdAndUpdate(req.params.id, { $set: updatecarpenterdata }, { new: true })
        if(!carpenterdetails)
        {
            return res.status(400).json({
                status:"Fail",
                message:"user not found"
            })
        }
        res.status(200).json({
            status: "Success",
            message: "Carpenter Update Successfully",
            data: carpenterdetails
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: "user not found"
        })
    }
}
// //===============================================================DELETE DATA====================================================================
exports.carpenters_delete = async function (req, res) {
    try {
        const carpenterdatadelete = await carpenter.findByIdAndDelete({ "_id": req.params.id });
        if (!carpenterdatadelete) {
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
exports.carpenters_viewdata = async function (req, res) {
    try {
        const viewdata = await carpenter.findById({ "_id": req.params.id });
        if (!viewdata) {
            return res.status(401).json({
                status: "Fail",
                message: "user not found"
            })
        }
        res.status(201).json({
            status: "Sucess",
            message: "Carpenter Fetch sucessfully",
            data: viewdata
        });
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message:"carpenter no fetch data"
        })
    }
}
// //========================================================================LIST DATA=========================================================
exports.carpenters_listdata = async function (req, res) {
    try {
        const carpenterId = req.params.id;
        const carpenterlistdata = await carpenter.find()
        dataCount=carpenterlistdata.length
        const usersConnectedTocarpenter = await user.aggregate([
            {
                $match: {
                    'carpenter_id': new mongoose.Types.ObjectId(carpenterId)
                }
            },
            {
                $lookup: {
                    from: 'carpenters',
                    localField: 'carpenter_id',
                    foreignField: '_id',
                    as: 'carpenterDetails'
                },
            },
            {
                $project:{
                    __v: 0,
                }
            }
        ]);

        if (usersConnectedTocarpenter.length === 0) {
            return res.status(404).json({
                status: "Fail",
                message: "No users connected to the carpenter"
            });
        }

        res.status(200).json({
            status: "Success",
            message: "get all data",
            count:dataCount,
            data: usersConnectedTocarpenter
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}
//==============================================================SEARCH DATA==================================================================
exports.carpentersdetails_searchdata = async function (req, res) {
    try {
        const nameField = req.query.carpentersName;

        console.log("Searching for carpenters with name: " + nameField);

        // Step 1: Find the carpenter by name
        const carpenterfind = await carpenter.findOne({ carpentersName: { $regex: nameField, $options: 'i' } }, '_id');

        console.log("Found carpenter: " + carpenterfind);

        if (!carpenterfind) {
            return res.status(404).json({
                status: "Fail",
                message: "Carpenter not found"
            });
        }

        const carpenterdata = await user.aggregate([
            {
                $match: { 'carpenter_id': carpenterfind._id }
            },
            {
                $lookup: {
                    from: "carpenters",
                    localField: "carpenter_id",
                    foreignField: "_id",
                    as: "carpenterData"
                }
            },
                {
            $project: {
                __v: 0,
                "carpenterData.__v": 0,
            }
           }
        ]).exec();

        console.log("Carpenter data: " + carpenterdata);

        if (!carpenterdata || carpenterdata.length === 0) {
            return res.status(404).json({
                status: "Fail",
                message: "Data not found"
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Fetch Data Successfully",
            data: carpenterdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}

//=========================================================================list=========================================================
exports.carpenterlist = async function (req, res, next) {
    try {
        const carpenterData = await carpenter.find()
        res.status(200).json({
            status: "Success",
            message: "get all data",
            data: carpenterData
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}