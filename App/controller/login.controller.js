var login = require('../model/login.model')
var Token=require('../model/token.model')
var jwt = require('jsonwebtoken');

exports.login_page = async function(req,res){
    try {
        const {login_id,password}=req.body
        const loginIdFind=await login.findOne({login_id})
        if(!loginIdFind){
            return res.status(404).json({
                status:"Fail",
                message:"Enter valid loginid"
            })
        }
        if(loginIdFind.password !== password){
            return res.status(400).json({
                status:"Fail",
                message:"Enter valid password"
            })
        }
        const payload={
            id:loginIdFind._id,
            login_id:loginIdFind.login_id,
            password:loginIdFind.password
        }
        var token = jwt.sign(payload, process.env.KEY,{expiresIn:'1d'});
        const tokensave = Token({
            id:loginIdFind._id,
            token:token
        })
        await tokensave.save()
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


