'use strict';

const asyncHandler = (fn) => (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // If Authorization header is missing
    console.warn('Authorization header is missing');
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const authComponents = authHeader.split(' ');
  if (authComponents.length !== 2 || authComponents[0] !== 'Basic') {
    // If Authorization header is not in the correct format
    console.warn('Authorization header is not in the correct format');
    return res.status(401).json({ error: 'Authorization header is not in the correct format' });
  }

  const base64Credentials = authComponents[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Check if the username and password match with your database records
  if (username === 'username' && password === 'password') {
    // Authentication successful, proceed to execute the route handler
    Promise.resolve(fn(req, res, next)).catch(next);
  } else {
    // Authentication failed, send 401 Unauthorized response
    console.warn('Invalid credentials');
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

module.exports = { asyncHandler };
