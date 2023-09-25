const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const shopschema = Schema({
    shopName:{
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
 const shops = mongoose.model('shop',shopschema)

 module.exports=shops;