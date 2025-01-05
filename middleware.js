const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader); // Log the header

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Unauthorized: Token not found or malformed');
    return res.status(401).json({ message: 'Unauthorized: Token not found or malformed' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token); // Log the token

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = verifyToken;