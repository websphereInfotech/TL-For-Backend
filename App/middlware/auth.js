const jwt = require('jsonwebtoken');

exports.verifytoken = (req, res, next) => {
    const token = req.headers["authorization"];
    
    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Authentication failed - No token provided'
        });
    }

    const actualToken = token.split(" ")[1];

    jwt.verify(actualToken, process.env.KEY, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                status: "fail",
                message: "JWT expired or invalid"
            });
        }

        // ✅ Attach user info (including role) to request
        req.user = decoded;

        next();
    });
};

exports.allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied"
            });
        }
        next();
    };
};
