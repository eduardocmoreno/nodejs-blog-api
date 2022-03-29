const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: [true, `Pleas add a text value`]
  }
}, { timestamps: true })

const Blog = mongoose.model('post', blogSchema);

module.exports = Blog;