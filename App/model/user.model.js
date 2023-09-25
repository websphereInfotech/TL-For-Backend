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
        unique: true
    },
    Address:{
        type:String,
        require:true
    },
    architecture_id:{
        type:String,
        require:true
    },
    carpenter_id:{
        type:String,
        require:true
    },
    shop_id:{
        type:String,
        require:true
    }
 });
 const user = mongoose.model('user',userschema)

 module.exports=user;