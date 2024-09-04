const router = require('express').Router();
const { format } = require('sequelize/lib/utils');
const { User,Post,Comment } = require('../models');
const withAuth = require('../utils/auth');


// HOME PAGE
// ---------
router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
     posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// -----------------------------------------------------------------------


router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});







// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      dashboard: true,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/post', (req, res) => {
  res.render('post', {
    logged_in: req.session.logged_in,
  });
});

// fetch the updated post based on id
// -----------------------

router.get('/postUpdate/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const data = postData.get({ plain: true });
   

    res.render('postUpdate', {
      ...data,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});



// login form
// ----------

router.get('/login', (req, res) => {
  
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});





// Comment
// -------



// Render comment format
// ---------------------
router.get('/comment/:id', async (req, res) => {
  try {
    const postWithComments = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'name'], 
            },
          ],
          attributes: ['id', 'comment', 'date_created'],
          order: [['createdAt', 'ASC']], 
        },
        
        // {
        //   model: User,
        //   attributes: ['id','name'],
        // },
      ],
    });

    if (!postWithComments) {
      return res.status(404).send('Post not found');
    }

    const posts = postWithComments.get({ plain: true });
    console.log(`Serialized data: ${JSON.stringify(posts, null, 2)}`);

    res.render('comment', {
      ...posts, post: postWithComments
    
    });
  } catch (err) {
    console.error('Error fetching post with comments:', err);
    res.status(500).send('Server error');
  }
});



// find all the comment
// -------------------
// Route to render comment details for a specific post
router.get('/comment-detail/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch a specific post with its comments and user details
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'name'], 
            },
          ],
          attributes: ['comment', 'date_created'], 
        },
      ],
    });

    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.status(200).json(post);
    console.log(post);

    // Serialize data
    const postDataWithComments = post.get({ plain: true });

    console.log(`SELIALIZED DATA: ${JSON.stringify(postDataWithComments, null, 2)}`);
    
    // Render comment-detail with the specific post and its comments
    res.render('comment-detail', { postDataWithComments });
  } catch (err) {
    console.error('Error fetching post and comments:', err);
    res.status(500).send('Server Error');
  }
});




module.exports = router;













