var login = require('../model/login.model')
var jwt = require('jsonwebtoken');

exports.Login_page = async function(req,res){
    try {
        const {login_id,password}=req.body
        const loginIdFind=await login.findOne({login_id})
        if(!loginIdFind){
            return res.status(404).json({
                status:"Fail",
                message:"Enter valid login_id"
            })
        }
        if(loginIdFind.password !== password){
            return res.status(400).json({
                status:"Fail",
                message:"Enter valid password"
            })
        }
        const payload={
            login_id:loginIdFind.login_id,
            password:loginIdFind.password
        }
        var token = jwt.sign(payload, process.env.KEY,{expiresIn:'1d'});
         if(loginIdFind.login_id === login_id && loginIdFind.password === password)
         {
            return res.status(200).json({
                status: "Success",
                message: "login successfull",
                token:token
            })
         }
    } catch (error) {
        res.status(404).json({
            status: "Fail",
            message: "fail to login"
        })
    }
}


