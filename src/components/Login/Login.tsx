import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext'; 
import useHttp from '../../hooks/useHttp';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import config from "../../config.json";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser(); 
  const { login } = useAuth();
  const { sendRequest, error, isLoading } = useHttp();

  const handleLogin = async () => {
    let url: string  = config.REACT_APP_SERVER_URL + "/api/login" || "";
    try {
      const requestData = {
        username,
        password,
      };
      const response = await sendRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

     
      console.log('login successful', response);
      setUser(response.user);
      login(response.token);
      navigate("/home");
      
     
    } catch (err) {
      console.error('login failed', err);
      
    }
    
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: '400px' }}>
        <div className="card-body">
          <h5 className="card-title">Login</h5>
          <form>
            <div className="form-group">
              <label htmlFor="email"> username</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <button
              type="button"
              className="btn btn-primary btn-block mt-3"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
          <p className="mt-3">
            Don't have an account? <a href="/register">Register here</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
