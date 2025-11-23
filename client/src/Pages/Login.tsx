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
                const session: any = await checkSession()
                if (!!session.username) {
                    navigate('/home')
                }
            } catch (err) {
                console.log('err ==> ', err)
            }
        }
        handleCheckSession();
    }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser({
        username,
        password
      });
    window.location.reload()
    } catch (error: any) {
        // @ts-ignore
        alert('Login failed. ' + error?.response?.data?.message ?? 'Unknown error occurred.')
    }
  };

  return (
    <div className="login-container">
      <h2>⚔️ Fantasy Loot Generator</h2>
        <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
        
        <div className="divider">or</div>
        
        <button 
          type="button"
          className="secondary-button"
          onClick={() => navigate('/create-user')}
        >
          Create New Account
        </button>
      </form>
    </div>
  );
};

export default Login;
