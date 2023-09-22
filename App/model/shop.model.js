const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const shopschema = Schema({
    shopName:{
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
 const shops = mongoose.model('shop',shopschema)

 module.exports=shops;