async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options
  });
  if (!response.ok) throw new Error(response.status);
  return response.status === 204 ? null : response.json();
}

document.querySelector('#loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const error = document.querySelector('.login-error');
  const button = event.currentTarget.querySelector('button[type="submit"]');
  error.textContent = '';
  button.disabled = true;
  try {
    await api('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: document.querySelector('#adminPassword').value
      })
    });
    window.location.href = '/dashboard';
  } catch {
    error.textContent = 'Incorrect password. Please try again.';
    button.disabled = false;
  }
});
document.querySelector('#passwordToggle').addEventListener('click', () => {
  const input = document.querySelector('#adminPassword');
  input.type = input.type === 'password' ? 'text' : 'password';
  document.querySelector('#passwordToggle i').classList.toggle('fa-eye-slash');
});
api('/api/session').then(result => {
  if (result.authenticated) window.location.replace('/dashboard');
});