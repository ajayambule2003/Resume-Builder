const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        let token;

        // Check for token in cookies
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // If token is not found in cookies, check headers
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }

        // If token is still not found, send 401 error
        if (!token) {
            return res.status(401).json({
                message: "Token not provided",
                error: true,
                success: false
            });
        }

        // Verify token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    message: "Token is not valid",
                    error: true,
                    success: false
                });
            }
            req.userId = decoded.id;
            next();
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;

