import { useState, useEffect } from 'react';
import { createUser, checkSession } from '../requests/userRequests';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleCheckSession = async () => {
      try {
        const test: any = await checkSession();
        if (!!test.username) {
          navigate('/home');
        }
      } catch (err) {
        console.log('err ==> ', err);
      }
    };
    handleCheckSession();
  }, []);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      await createUser({
        username,
        password
      });
      // Redirect to login page after successful creation
      navigate('/login');
    } catch (error: any) {
        alert('Error creating user: ' + error.response.data.message)
    }
  };

  return (
    <div className="login-container">
      <h2>⚔️ Create Your Account</h2>
      <form onSubmit={handleCreateUser}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
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
            placeholder="Create a password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit">Create Account</button>
        
        <div className="divider">or</div>
        
        <button 
          type="button"
          className="secondary-button"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default CreateUser;