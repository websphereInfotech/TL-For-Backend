var jwt = require('jsonwebtoken');
const user = require('../model/user.model');
const shops=require('../model/shop.model');
const carpenter = require('../model/carpenter.model');
const architec = require('../model/architec.model');

exports.userdetails_create = async function (req, res) {
    try {
        const { userName, mobileNo, address, serialNumber,rate,description,quantity,architecture_id, carpenter_id, shop_id } = req.body;
        const checkmobilno = await user.findOne({ mobileNo })
        if ( checkmobilno ) {
            return res.status(400).json({
                status:"Fail",
                message:"Mobile Number Already Exist"
            })
        }
        const checkserialno = await user.findOne({ serialNumber})
        if ( checkserialno ) {
            return res.status(400).json({
                status:"Fail",
                message:"Serial Number Already Exist"
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
            shop_id,
        })
        await userData.save();

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
            message: "User Create Successfully",
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
            message: "User Update Successfully",
            data: userdata
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: "user not found"
        })
    }
}
 //===============================================================DELETE DATA====================================================================
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
        const userviewdata = await user.findById({ "_id": req.params.id }).populate('architecture_id carpenter_id shop_id');;
        if (!userviewdata) {
            return res.status(400).json({
                status: "Fail",
                message: "user not found"
            })
        }
        res.status(201).json({
            status: "Sucess",
            message: "User Fetch Sucessfully",
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
        const users = await user.aggregate([
            {
                $lookup: {
                    from: 'shops',
                    localField: 'shop_id',
                    foreignField: '_id',
                    as: 'shop'
                }
            },
            {
                $lookup: {
                    from: 'carpenters',
                    localField: 'carpenter_id',
                    foreignField: '_id',
                    as: 'carpenter'
                }
            },
            {
                $lookup: {
                    from: 'architectuers',
                    localField: 'architecture_id',
                    foreignField: '_id',
                    as: 'architecture'
                }
            },
            {
                $project:{
                    __v: 0,
                    "shop.__v": 0,
                    "carpenter.__v": 0,
                    "architecture.__v": 0   
                }
            }
            
        ]);
        const listdata= await user.find()
        var Datacount = listdata.length;

        res.status(200).json({
            status: "Success",
            message: "get all data",
            count: Datacount,
            data: users
        });
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        });
    }
}
    
//============================================================================SERCH DATA=========================================================
exports.userdetails_searchdata = async function (req, res) {
    try {
        const nameFeild=req.query.userName
        if (!nameFeild) {
            return res.status(400).json({
                status: "Fail",
                message: "Please provide a userName parameter in the URL."
            });
        }
        const searchdata = await user.findOne({userName:{$regex:nameFeild,$options: 'i' }})

        
        if (!searchdata) {
            return res.status(404).json({
                status: "Fail",
                message: "user not found"
            });
        }
       
        const userData = await user.aggregate([
            {
                $lookup: {
                    from: 'shops',
                    localField: 'shop_id',
                    foreignField: '_id',
                    as: 'shop'
                }
            },
            {
                $lookup: {
                    from: 'carpenters',
                    localField: 'carpenter_id',
                    foreignField: '_id',
                    as: 'carpenter'
                }
            },
            {
                $lookup: {
                    from: 'architectuers',
                    localField: 'architecture_id',
                    foreignField: '_id',
                    as: 'architecture'
                }
            },
            {
                $project:{
                    __v: 0,
                    "shop.__v": 0,
                    "carpenter.__v": 0,
                    "architecture.__v": 0   
                }
            }
            
        ]);
        res.status(200).json({
            status: "Success",
            message: "Fetch Successfully",
            data: userData
        })
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: error.message
        })
    }
}