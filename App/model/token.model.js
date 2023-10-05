const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const tokenschema = Schema({
    id:{
        type: mongoose.SchemaTypes.ObjectId,
    },
    token:{
        type:String
        }
 });
 const token = mongoose.model('token',tokenschema)

 module.exports=token;