const jwt = require('jsonwebtoken');
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.sendStatus(403); // Forbidden
      }
      console.log('JWT decoded:', decoded);
      req.user = decoded; // Store decoded user information in request object
      next();
    });
  } else {
    console.warn('Authorization header not found');
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = { asyncHandler, authenticateJWT };