const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const architecschema = Schema({
    architecsName:{
        type: String,
        require:true
    },
    mobileNo:{
        type:String,
        require:true,
        // uniqe:true
    },
    Address:{
        type:String,
        require:true
    }
 });
 const architec = mongoose.model('architectuer',architecschema)

 module.exports=architec;