const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const userschema = Schema({
    userName:{
        type: String,
        require:true
    },
    mobileNo:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    serialNumber:{
        type:Number,
        require:true
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
    }
 });
 const user = mongoose.model('user',userschema)

 module.exports=user;