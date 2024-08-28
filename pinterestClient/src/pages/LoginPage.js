import React, { useState } from 'react';
import { login, register } from '../services/api'; // Import the API functions

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('watcher'); // Default role
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    try {
      const user = await login({ username, password });
      if (user && user.id) {
        // Save user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Redirect to feed page
        window.location.href = '/feed';
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('Error logging in. Please try again.');
    }
  };

  const handleRegister = async () => {
    setError(''); // Clear previous errors
    try {
      const user = await register({ username, email, password, role });
      if (user && user.id) {
        // Save user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Redirect to feed page
        window.location.href = '/feed';
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Error registering. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  return (
    <div className="login-page">
      <h1>{isLoginMode ? 'Login' : 'Register'}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          isLoginMode ? handleLogin() : handleRegister();
        }}
      >
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {!isLoginMode && (
          <>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="watcher">Watcher</option>
                <option value="creator">Creator</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </>
        )}
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <div>
          <button type="submit">{isLoginMode ? 'Login' : 'Register'}</button>
        </div>
      </form>
      <div>
        <button onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </div>
      {localStorage.getItem('currentUser') && (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
