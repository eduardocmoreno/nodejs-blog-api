const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { getAllPosts, getAllPostsByUser, getOnePost, createPost, updatePost, deletePost } = require('../controllers/blogController');

const router = Router();

router.get('/blog/posts', getAllPosts);
router.get('/blog/posts/:id', getAllPostsByUser);
router.get('/blog/post/:id', getOnePost);
router.post('/blog/add', requireAuth, createPost);
router.post('/blog/post/update/:id', requireAuth, updatePost);
router.post('/blog/post/delete/:id', requireAuth, deletePost);

module.exports = router;