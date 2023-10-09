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
       type:String
    }],
    carpenter_id:[{
        type:String
     }],
    shop_id:[{
       type:String
    }],
    architecture:[{
       _id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'architectuer'
       },
       architecsName:{
         type:String
       },
       mobileNo:{
        type:Number,
        require:true,
        unique: true
    },
    address:{
        type:String
    }
    }],
    shop: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shop'
        },
        shopName:{
            type:String
        } ,
        mobileNo:{
            type:Number,
            require:true,
            unique: true
        },
        address:{
            type:String
        }
 }],
    carpenter:[{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carpenter'
        },
        carpentersName:{
            type:String
        } ,
        mobileNo:{
            type:Number,
            require:true,
            unique: true
        },
        address:{
            type:String
        }
 }]

 },{ strictPopulate: false });
 const user = mongoose.model('user',userschema)

 module.exports=user;