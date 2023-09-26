const jwt = require('jsonwebtoken')
const Token = require('../model/token.model')

exports.verifytoken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'authentication fail'
        });
    }
    let istoken = token.split(" ")[1];
    jwt.verify(istoken, process.env.KEY, async (error, VerifyToken) => {
        try {
            const Tokenverify = await Token.findOne({ token:istoken, isActive: true })
            if (!Tokenverify || error) {
                return res.status(400).json({
                    status: "Fail",
                    message: "Fail to verify"
                })
            }
            req.token = VerifyToken
            next();
        } catch (error) {
            return res.status(404).json({
                status: "Fail",
                message: error.message
            })
        }
    })
}