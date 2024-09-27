import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../config.json';
import useHttp from '../../hooks/useHttp';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const navigate = useNavigate();
  const { sendRequest, error, isLoading } = useHttp();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    const url = config.REACT_APP_SERVER_URL + "/api/register" || "";
  
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (photo) {
        formData.append('photo', photo);
      }
  
    
      const response = await sendRequest(url, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        navigate("/");
        console.log('Registration successful');
      } else {
        console.error('Registration failed');
      }
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  const handlePhotoChange = (e: any) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: '400px' }}>
        <div className="card-body">
          <h5 className="card-title">Register</h5>
          <form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="photo">Profile Photo</label>
              <input
                type="file"
                className="form-control"
                id="photo"
                onChange={handlePhotoChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block mt-3"
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
          <p className="mt-3">
            Already have an account? <a href="/login">Login here</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
