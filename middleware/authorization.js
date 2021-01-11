const jwt = require('jsonwebtoken');

const privateKey = process.env.JWT_PRIVATE_KEY;

module.exports = {
    validateToken: (req, res, next) => {
        const authorizationHeader = req.headers.authorization;

        if (authorizationHeader) {
            // Get Bearer token
            const token = req.headers.authorization.split(' ')[1];

            try {
                const decoded = jwt.verify(token, privateKey);
                next();
            } catch (err) {
                res.status(403).send({
                    status: 'forbidden',
                    message: 'Token is invalid. API request is forbidden.'
                });
            }
        } else {
            res.status(401).send({
                status: 'Unauthorized',
                message: 'Authorization error. Token required'
            });
        }
    }
};
