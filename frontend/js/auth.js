// Authentication & Authorization Helper
const Auth = {
  getToken() {
    return localStorage.getItem('apfms_jwt_token');
  },

  getUser() {
    const u = localStorage.getItem('apfms_user');
    return u ? JSON.parse(u) : null;
  },

  setSession(token, user) {
    localStorage.setItem('apfms_jwt_token', token);
    localStorage.setItem('apfms_user', JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem('apfms_jwt_token');
    localStorage.removeItem('apfms_user');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  checkProtectedPage() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },

  logout() {
    this.clearSession();
    window.location.href = 'login.html';
  },

  async fetchWithAuth(url, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const res = await fetch(url, { ...options, headers });
    
    if (res.status === 401) {
      this.clearSession();
      window.location.href = 'login.html';
      throw new Error('Session expired. Please log in again.');
    }
    
    return res;
  }
};
