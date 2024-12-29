const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    try {
        // Get token from the Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Token not found' });
        }

        // Extract the token
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validate the decoded token
        if (!decoded || !decoded.user || !decoded.user.id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
        }

        req.user = decoded.user; // Attach user object (with ID) to request
        next(); // Pass control to the next middleware
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
