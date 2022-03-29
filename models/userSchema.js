const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must contain at least 8 characters']
  }
}, { timestamps: true });

// Password hasher middleware (happens before saving event)
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* 
* Static method to LOGIN user
* @param  {string}  email
* @param  {string}  password
*/
userSchema.statics.login = async function ({ email, password }) {
  let errors = {};

  try {
    //check if email is valid
    if (!isEmail(email)) {
      errors.email = 'Please enter a valid email';
      throw Error;
    }

    //find user by e-mail
    const user = await this.findOne({ email });

    //if email not found, throw error
    if (!user) {
      errors.email = 'E-mail not found!';
      throw Error;
    };

    //if passwords don`t match, throw error
    if (!await bcrypt.compare(password, user.password)) {
      errors.password = 'Wrong password!';
      throw Error;
    };

    //all good? then return user obj
    return user;
  }

  catch (err) {
    throw new Error('Login failed!', { cause: errors });
  }
}

/* 
* Static method to REGISTER user
* @param  {string}  email
* @param  {string}  password
*/
userSchema.statics.signup = async function ({ name, email, password }) {
  let errors = {};

  try {
    //try to register a new user with the given data
    const user = await this.create({ name, email, password });

    //if success, return user obj
    return user;
  }

  catch (err) {
    // validation errors
    if (err.name === 'ValidationError') {
      Object.entries(err.errors).forEach(([key, value]) => {
        errors[key] = value.message;
      });
    }

    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'E-mail already registered! Try to login instead!';
    }

    throw new Error('Register failed!', { cause: errors });
  }
}

const User = mongoose.model('user', userSchema);

module.exports = User;