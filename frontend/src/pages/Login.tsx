import React, { useState, useEffect } from 'react';
import axios from '../services/api';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: 'demo@example.com',
    password: 'demo123',
    name: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for token in URL params (from Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');
    
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);
      setMessage('✅ Google Sign-In successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(endpoint, formData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setMessage('✅ Success! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error: any) {
      setMessage(`❌ ${error.response?.data?.error || 'Authentication failed'}`);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/google');
      window.location.href = response.data.authUrl;
    } catch (error) {
      setMessage('❌ Google Sign-In failed. Please try again.');
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    // For demo purposes, set a mock token
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify({
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User'
    }));
    window.location.href = '/';
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 24 }}>
      <h2>{isLogin ? '🔐 Login' : '📝 Sign Up'}</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        {!isLogin && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4 }}
              required={!isLogin}
            />
          </div>
        )}
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4 }}
            required
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 4 }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 12
          }}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      {/* Google Sign-In Button */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: '#db4437',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ margin: '16px 0', color: '#666', fontSize: 14 }}>or</div>
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={loginAsDemo}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          🚀 Continue as Demo User
        </button>
      </div>
      
      {message && (
        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: 4,
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      
      <div style={{
        marginTop: 24,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 4,
        fontSize: 12,
        color: '#666'
      }}>
        <strong>Demo Credentials:</strong><br />
        Email: demo@example.com<br />
        Password: demo123
      </div>
    </div>
  );
};

export default Login;
