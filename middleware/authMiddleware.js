const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

async function requireAuth(req, res, next) {
  try {
    //find related user as author
    const user = await User.findById(req.body.user);

    if (!user) throw new Error('User not found!');

    //verify token
    const token = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

    if (!token) throw new Error('Token verification failed!');

    //proceed if no errors
    next();
  }

  catch (err) {
    res.status(401).json({ errors: err.message });
  }
}

module.exports = { requireAuth };