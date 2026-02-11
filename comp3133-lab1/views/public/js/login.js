document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');

  errorDiv.classList.add('hidden');
  successDiv.classList.add('hidden');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store user info in localStorage
      localStorage.setItem('username', data.username);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('firstname', data.firstname);
      localStorage.setItem('lastname', data.lastname);

      successDiv.textContent = 'Login successful! Redirecting to chat...';
      successDiv.classList.remove('hidden');

      setTimeout(() => {
        window.location.href = '/chat.html';
      }, 1500);
    } else {
      errorDiv.textContent = data.error || 'Login failed';
      errorDiv.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error:', err);
    errorDiv.textContent = 'An error occurred during login';
    errorDiv.classList.remove('hidden');
  }
});
