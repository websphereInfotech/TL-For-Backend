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
    jwt.verify(istoken, process.env.KEY, (error) => {
        if (error  ) {
            console.error(error); 
           return res.status(401).json({
                status: "fail",
                message: "JWT expired"
            })
        }
       next();
        
    })
}