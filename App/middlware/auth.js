const jwt = require('jsonwebtoken')

exports.verifytoken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'authentication fail'
        });
    }
    let istoken = token.split(" ")[1];
    jwt.verify(istoken, process.env.KEY, async (error) => {
        try {
            if (error) {
                return res.status(400).json({
                    status: "Fail",
                    message: "JWT expired"
                })
            }
            next();
        } catch (error) {
            return res.status(404).json({
                status: "Fail",
                message: error.message
            })
        }
    })
}