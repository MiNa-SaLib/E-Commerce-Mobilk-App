const jwt = require('jsonwebtoken');
const { FAIL, ERROR } = require('../Utilities/httpStatus');
const SECRET_KEY = process.env.JWT_PRIVATE_KEY;

 const TokenVerification=(req, res, next)=> {
    const token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(401).json({
                status:FAIL,
                message: 'Invalid Token Format'
            })
        }
        const decodeUser = jwt.verify(token, SECRET_KEY);
        req.currentUser=decodeUser;
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status:FAIL,
                message: 'Session Expired',
                error: error.message,
            })
        }
        if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
            return res.status(401).json({
                status:FAIL,
                message: 'Invalid Token',
                error: error.message,
            })
        }
        res.status(500).json({
            status:ERROR,
            message: 'Internal server Error',
            error: error.message
        });
    }
}

module.exports = TokenVerification