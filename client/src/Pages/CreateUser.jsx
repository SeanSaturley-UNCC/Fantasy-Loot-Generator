import { useState, useEffect } from 'react';
import { createUser, checkSession } from '../requests/userRequests';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleCheckSession = async () => {
      try {
        const test = await checkSession();
        if (!!test.username) {
          navigate('/home');
        }
      } catch (err) {
        console.log('err ==> ', err);
      }
    };
    handleCheckSession();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      await createUser({
        username,
        email,
        password
      });
      // Redirect to login page after successful creation
      navigate('/login');
    } catch (error) {
        alert('Error creating user: ' + error.response.data.message)
    }
  };

  return (
    <div className="login-container">
      <h2>Fantasy Loot Generator Sign Up</h2>
      <form onSubmit={handleCreateUser}>
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create Account</button>
        
        <button 
          type="button"
          onClick={() => navigate('/login')}
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
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default CreateUser;