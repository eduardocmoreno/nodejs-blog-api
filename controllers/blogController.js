const jwt = require('jsonwebtoken');
const Blog = require('../models/blogSchema');

//GET All posts
async function getAllPosts(req, res) {
  const posts = await Blog.find().sort('-updatedAt').populate('author', 'id name email');
  res.status(200).json(posts);
}

//GET All posts by user id
async function getAllPostsByUser(req, res) {
  const posts = await Blog.find({ author: req.params.id }).sort('-updatedAt').populate('author', 'id name email');
  res.status(200).json(posts);
}

//GET ONE post BY id
async function getOnePost(req, res) {
  const post = await Blog.findById(req.params.id).populate('author', 'id name email');
  res.status(200).json(post);
}

//ADD new post
async function createPost(req, res) {
  await handlePost(req, res, 'CREATE');
}

//UPDATE post
async function updatePost(req, res) {
  await handlePost(req, res, 'UPDATE');
}

//DELETE post
async function deletePost(req, res) {
  await handlePost(req, res, 'DELETE');
}

//HANDLE CREATE/UPDATE posts
async function handlePost(req, res, method) {
  let errors = {};

  try {
    //config post payload
    let post;

    const payload = {
      author: req.body.user,
      title: req.body.title,
      body: req.body.body
    }

    switch (method) {
      case 'CREATE': {
        post = await Blog.create(payload);
        break;
      }
      case 'UPDATE': {
        post = await Blog.findByIdAndUpdate(req.params.id, payload, { new: true });
        break;
      }
      case 'DELETE': {
        post = await Blog.findByIdAndDelete(req.params.id);
        break;
      }
    }

    if (!post) {
      errors.token = `Post not created! postId: ${req.body.post}`
      throw new Error();
    }

    //if success, return user obj
    res.status(200).json(post);
  }

  catch (err) {
    res.status(400).json({ errors: err.message });
  }
}

module.exports = { getAllPosts, getAllPostsByUser, getOnePost, createPost, updatePost, deletePost };