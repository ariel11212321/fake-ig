import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AddPost from './components/AddPost';
import './App.css';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/AppThemeContext';
import Settings from './components/Settings';


function App() {

  return (
    <UserProvider>
    <AuthProvider>
    <ThemeProvider>
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/settings" element={<Settings/>}/>
          <Route path = "/addPost" element={<AddPost/>} />
        </Routes>
    </Router>
    </ThemeProvider>
    </AuthProvider>
    </UserProvider>
  );
}

export default App;
