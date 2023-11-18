const express = require('express');

const authenticateMiddleware = require('../middleware/authenticate');
const uploadMiddleware = require('../middleware/upload');
const postController = require('..//controllers/post-contoller');
const likeController = require('../controllers/like-controller');

const router = express.Router();

router.post(
  '/',
  authenticateMiddleware,
  uploadMiddleware.single('image'),
  postController.createPost
);
router.get(
  '/friend',
  authenticateMiddleware,
  postController.getAllPostIncludeFriendPost
);
router.post('/:postId/like', authenticateMiddleware, likeController.toggleLike);
router.delete('/:postId', authenticateMiddleware,postController.deletePost);

module.exports = router;