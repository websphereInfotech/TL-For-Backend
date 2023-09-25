const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const carpenterschema = Schema({
    carpentersName:{
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
    }
 });
 const carpenter = mongoose.model('carpenter',carpenterschema)

 module.exports=carpenter;