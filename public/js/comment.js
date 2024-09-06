const addComment = async (event) => {
  event.preventDefault();

  const commentContent = document.querySelector('#comment-content').value.trim();
  const postId = document.querySelector('#post-id-to-comment').value.trim();
  const userId = document.querySelector('#user-id-to-comment').value.trim();
  
  try {
    if (commentContent && postId) {
      const response = await fetch('/api/comments', { 
        method: 'POST',
        body: JSON.stringify({ comment: commentContent, post_id: postId, user_id: userId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace(`/comment/${postId}`); 
      } else {
        const errorText = await response.text();
        alert('Failed to create comment: ' + errorText);
      }
    } else {
      alert('Comment and Post ID are required.');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred while creating the comment.');
  }
};

document.querySelector('.comment-form').addEventListener('submit', addComment);
