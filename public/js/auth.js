// Check authentication status
async function checkAuth() {
  try {
    const response = await fetch('/api/check-session');
    const data = await response.json();
    
    if (!data.authenticated) {
      if (!window.location.pathname.includes('login.html')) {
        window.location.href = '/login.html';
      }
    } else {
      if (window.location.pathname.includes('login.html')) {
        window.location.href = '/dashboard.html';
      }
    }
  } catch (error) {
    console.error('Auth check error:', error);
  }
}

// Logout function
async function logout() {
  try {
    const response = await fetch('/api/logout', { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      window.location.href = '/login.html';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Initialize auth check on page load (except login page)
if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('inventory.html')) {
  checkAuth();
}

