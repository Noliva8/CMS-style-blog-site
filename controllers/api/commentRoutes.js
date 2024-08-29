const router = require('express').Router();
const {User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// CREATE A COMMENT
// ---------------

router.post('/', async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
    });
console.log(newComment);
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// ----------------------------------------------------
module.exports = router;