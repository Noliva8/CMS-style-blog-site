document.addEventListener('DOMContentLoaded', () => {
  const updatePostEl = document.querySelector('.new-post-update-form');

  const updatePostHandler = async (event) => {
    event.preventDefault();

    // Get the post ID from the URL
    const url = window.location.pathname;
    const postId = url.split('/').pop();

    // Extract form values
    const title = document.querySelector('#post-update-title').value.trim();
    const content = document.querySelector('#post-update-content').value.trim();

    try {
      // Send the PUT request to update the post
      const response = await fetch(`/api/posts/postUpdate/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/dashboard'); 
      } else {
        alert('Failed to update the post');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error updating post');
    }
  };

  // Ensure the form exists before adding the event listener
  if (updatePostEl) {
    updatePostEl.addEventListener('submit', updatePostHandler);
  }
});



// DELETE BUTTON
// ---------


const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete post');
    }
  }
};

// Attach event listener to the document or specific container
document.addEventListener('click', delButtonHandler);