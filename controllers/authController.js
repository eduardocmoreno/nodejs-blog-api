const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

//REGISTER NEW USER
async function signup_post(req, res) {
  auth(res, 'signup', req.body);
};


//LOGIN
async function login_post(req, res) {
  auth(res, 'login', req.body);
};


//LOGOUT
async function logout_get(req, res) {
  //replace current token with a blank string and after 1ms force it expire
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'User logged out successfuly!' });
}


/* 
* Create JWT Token
* @param  {string} id - User Id
*/
function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

/* 
* Auth Function
* @param  {object} res - Response Method
* @param  {string} type - "login" | "signup"
* @param  {object} fields - Form data { name, email, password }
*/
async function auth(res, type, fields) {
  try {
    const user = await User[type](fields);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 * 7 });
    res.status(type === 'signup' ? 201 : 200).json({ id: user._id, name: user.name, email: user.email });
  }

  catch (error) {
    res.status(400).json({ errors: error.cause });
  }
}

module.exports = { signup_post, login_post, logout_get }