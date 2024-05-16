'use strict';
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

const authUser = async (req, res, next) => {
  const credentials = auth(req);

  if (!credentials) {
    console.warn('Authorization header or username not found');
    return res.status(401).json({ message: 'Authorization header or username not found' });
  }

  console.log('Received credentials:', credentials);

  const user = await User.findOne({ where: { emailAddress: credentials.name } });
  if (!user) {
    console.warn('User not found');
    return res.status(401).json({ message: 'User not found' });
  }

  const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
  if (!authenticated) {
    console.warn(`Authentication failure for ${user.emailAddress}`);
    return res.status(401).json({ message: 'Authentication failure' });
  }

  console.log(`Authentication successful for username: ${user.emailAddress}`);
  req.currentUser = user;
  next();
};

module.exports = authUser;
