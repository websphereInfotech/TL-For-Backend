const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const carpenterschema = Schema({
    carpentersName:{
        type: String,
        require:true
    },
    mobileNo:{
        type:String,
        require:true
    },
    Address:{
        type:String,
        require:true
    }
 });
 const carpenter = mongoose.model('carpenter',carpenterschema)

 module.exports=carpenter;