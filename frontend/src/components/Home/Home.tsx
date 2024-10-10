import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../Sidebar';
import { useUser } from '../../contexts/UserContext';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useHttp from '../../hooks/useHttp';
import config from '../../config.json';
import Post from '../Post';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/AppThemeContext';
export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { sendRequest, error, isLoading } = useHttp();
  const {token, isAuthenticated} = useAuth();
  const { theme, toggleTheme } = useTheme();

  if(!isAuthenticated) {
    navigate("/");
  }

  useEffect(() => {

    if(!token) {
      navigate("/login");
    }

    const fetchPosts = async () => {
      const url = `${config.REACT_APP_SERVER_URL}/api/posts`;
      try {
        const responseData = await sendRequest(url, {
          method: 'GET', headers: {'Authorization': 'Bearer ' + token}
        });
        setPosts(responseData); 
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, [sendRequest, token]);

  return (
    <div className={`d-flex ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Sidebar />
      <div className="container">
      <div className="d-flex align-items-center mt-4"> {/* Flex container */}
          <img
            src={`${config.REACT_APP_SERVER_URL}/${user?.photo}`}
            alt="Profile Pic"
            className="img-fluid rounded-circle"
            style={{ width: '100px', height: '100px' }}
          />
          <h1 className="ms-4">Welcome {user?.username}</h1>
        </div>
      
        <div className="mt-4">
          <h2>Posts</h2>
          {isLoading && <p>Loading posts...</p>}
          {error && <p>Error fetching posts: {error}</p>}
          <div className="list-group">
            {posts.map((post) => (
                <div className='mb-4'>
                  <Post post={post} edit={false} onEditSubmit={null}/>
                  </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
