document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const password = document.getElementById('password').value;

  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');

  errorDiv.classList.add('hidden');
  successDiv.classList.add('hidden');

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        firstname,
        lastname,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      successDiv.textContent = 'Signup successful! Redirecting to login...';
      successDiv.classList.remove('hidden');

      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
    } else {
      errorDiv.textContent = data.error || 'Signup failed';
      errorDiv.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error:', err);
    errorDiv.textContent = 'An error occurred during signup';
    errorDiv.classList.remove('hidden');
  }
});
