const { string, array } = require('joi');
const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const userschema = Schema({
    userName:{
        type: String,
        require:true
    },
    mobileNo:{
        type:Number,
        require:true,
        unique:true
    },
    address:{
        type:String
    },
    serialNumber:{
        type:Number,
        require:true,
        unique:true
    },
    rate:{
        type:Number,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    architecture_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'architectuer'
    }],
    carpenter_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'carpenter'
     }],
    shop_id:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'shop'
    }],

 },{ strictPopulate: false });
 const user = mongoose.model('user',userschema)

 module.exports=user;