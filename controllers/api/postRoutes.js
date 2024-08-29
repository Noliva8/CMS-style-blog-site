const router = require('express').Router();
const {User, Post } = require('../../models');
const withAuth = require('../../utils/auth');




// create posts
// ------------

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});


// Route to show the post form
// ----------------------------
// router.get('/newPost', (req, res) => {
//   res.render('newPost', {
//     logged_in: req.session.logged_in,
//   });
// });



// delete post
// ---------

router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id; 
    const result = await Post.destroy({
      where: { id: postId }
    });

    if (result) {
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});





// UPDATE POST
// -----------


router.put('/postUpdate/:id', async (req, res) => {
  try {
    
    const { title, content } = req.body;

    // Update the post in the database
    const [updated] = await Post.update(
      { title, content }, 
      { where: { id: req.params.id } } 
    );

    if (!updated) {
      // Handle the case where no rows were updated
      console.log('Failed to update data');
      return res.status(404).json({ message: 'Post not found' });
    }

    // Fetch the updated post data
    const updatedPost = await Post.findByPk(req.params.id);
    
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json(err);
  }
});





module.exports = router;