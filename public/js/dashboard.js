

const delButtonHandler = async (event) => {
  // Check if the clicked target has a 'data-id' attribute
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id'); 
    try {
      // Send DELETE request to the server
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Redirect to the dashboard or update the page content
        document.location.replace('/dashboard');
      } else {
        // Handle unsuccessful delete operation
        alert('Failed to delete post');
      }
    } catch (err) {
      // Handle network or other errors
      console.error('Error:', err);
      alert('Error deleting post');
    }
  }
};

// Attach event listener to the document or specific container
document.addEventListener('click', delButtonHandler);
