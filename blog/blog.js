let posts = [];

function renderPosts(order = 'newest') {
  const container = document.getElementById('blog-posts');
  container.innerHTML = ''; // Clear previous

  // Get current date (at midnight to avoid time zone issues)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter out future-dated posts
  const visiblePosts = posts.filter(post => {
    const postDate = new Date(post.date);
    return postDate <= today && post.content.trim() !== '';
  });

  // Sort by date
  const sorted = visiblePosts.sort((a, b) => {
    return order === 'newest'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  // Render visible posts
  sorted.forEach((post, index) => {
    const div = document.createElement('div');
    div.className = 'post';
    div.id = `post-${index}`;
    div.innerHTML = `
      <h3>${post.title}</h3>
      <small>${post.date}</small>
      <p>${post.content}</p>
    `;
    container.appendChild(div);
  });
}

fetch('blog.json')
  .then(res => res.json())
  .then(data => {
    posts = data;
    renderPosts();

    // Scroll controls
    document.getElementById('first-entry-link').addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('post-0')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('last-entry-link').addEventListener('click', e => {
      e.preventDefault();
      const lastIndex = document.querySelectorAll('.post').length - 1;
      document.getElementById(`post-${lastIndex}`)?.scrollIntoView({ behavior: 'smooth' });
    });

    // Sort control
    document.getElementById('sort-order').addEventListener('change', e => {
      renderPosts(e.target.value);
    });
  });
