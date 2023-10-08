const { string } = require('joi');
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
    architecture_id:{
       type:String
    },
    carpenter_id:{
      type:String 
    },
    shop_id:{
       type:String
    },
    architecture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'architectuer'
    },
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'shop'
    },
    carpenter:{
        type:mongoose.Schema.Types.ObjectId,    
        ref:'carpenter'
    }

 },{ strictPopulate: false });
 const user = mongoose.model('user',userschema)

 module.exports=user;