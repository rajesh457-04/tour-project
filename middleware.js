const jwt = require('jsonwebtoken');
require('dotenv').config(); // Make sure environment variables are loaded

module.exports = function(req, res, next) {
    try {
        // Check for token in the request header
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({ message: 'Authorization denied: Token not found' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({ message: 'Authorization denied: Invalid token' });
    }
};
