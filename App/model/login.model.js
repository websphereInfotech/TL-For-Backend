const mongoose= require('mongoose')
const Schema = mongoose.Schema;

 const loginschema = Schema({
    login_id:{
        type: String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
 });
 const login = mongoose.model('login',loginschema)

 module.exports=login;