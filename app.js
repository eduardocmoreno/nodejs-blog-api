//deps
const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

//init app
const app = express();

//use extra tools
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//db connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(5000, () => {
    console.log('Database Successfuly Connected');
    console.log('Blog server running at http://localhost:5000');
  }))
  .catch(err => console.log(err));


//Auth Routes
app.use(authRoutes);
app.use(blogRoutes);

//First blood
app.use(async (req, res) => {
  res.send('Hello World!');
});