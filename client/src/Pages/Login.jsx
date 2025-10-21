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
                const test = await checkSession()
                console.log('test ==> ', test)
                if (!!test.username) {
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
    //   console.log({
    //     username,
    //     password
    //   })
      await loginUser({
        username,
        password
      });
    } catch (error) {
      // Empty catch block as requested
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
      </form>
    </div>
  );
};

export default Login;
