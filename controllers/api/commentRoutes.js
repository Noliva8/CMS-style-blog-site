const router = require('express').Router();
const {User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// CREATE A COMMENT
// ---------------

router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      comment: req.body.comment,
       user_id: req.session.user_id,
        post_id: req.body.post_id,
    });
console.log(newComment);
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// ----------------------------------------------------
module.exports = router;