import React, { useState, useEffect } from 'react';
import { loginUser, checkSession } from '../requests/userRequests';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  
    useEffect(() => {
        const handleCheckSession = async () => {
            try {
                const session = await checkSession()
                if (!!session.username) {
                    navigate('/home')
                }
            } catch (err) {
                console.log('err ==> ', err)
            }
        }
        handleCheckSession();
    }, [])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser({
        username,
        password
      });
      navigate('/home')
    } catch (error) {
        console.log('error ==> ', error)
        alert('Login failed. ' + error?.response?.data?.message ?? 'Unknown error occurred.')
    }
  };

  return (
    <div className="login-container">
      <h2>Fantasy Loot Generator Login</h2>
        <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        
        <button 
          type="button"
          onClick={() => navigate('/create-user')}
          style={{ 
            marginTop: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create New Account
        </button>
      </form>
    </div>
  );
};

export default Login;
