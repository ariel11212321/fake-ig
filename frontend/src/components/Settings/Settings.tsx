// Settings.tsx
import React from 'react';
import { useTheme } from '../../contexts/AppThemeContext';
import { Card, Form } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();

  if(!isAuthenticated) {
    navigate("/");
  }
  return (
    <div className={`d-flex ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Sidebar />
      <div className="container mt-4 flex-grow-1">
        <Card className={`p-4 shadow ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white'}`}>
          <Card.Title className="mb-4">Settings</Card.Title>
          <Form>
            <Form.Group controlId="themeToggle">
              <Form.Check
                type="switch"
                id="custom-switch"
                label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            </Form.Group>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
