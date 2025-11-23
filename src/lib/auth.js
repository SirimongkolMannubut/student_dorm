export function getTokenFromCookie() {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    console.log('Token from cookie:', token); // Debug log
    return token;
  }
  return null;
}

export function getUserFromToken() {
  const token = getTokenFromCookie();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload); // Debug log
    return payload;
  } catch {
    return null;
  }
}

export function isAdmin() {
  const user = getUserFromToken();
  console.log('Checking admin, user:', user); // Debug log
  return user?.role === 'admin';
}

export function isLoggedIn() {
  return !!getTokenFromCookie();
}