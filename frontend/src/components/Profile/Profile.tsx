import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../Sidebar';
import { useUser } from '../../contexts/UserContext';
import config from '../../config.json';
import useHttp from '../../hooks/useHttp';
import { useAuth } from '../../contexts/AuthContext';
import Post from '../Post';
import './Profile.css';
import PopUp from '../Popup';
import MessageModal from '../MessageModal';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/AppThemeContext';

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ type: 'info', message: '' });
  const { sendRequest } = useHttp();
  const navigate = useNavigate();
  const { user } = useUser();
  const { token } = useAuth();
  const { theme } = useTheme();

  const photoUrl = `${config.REACT_APP_SERVER_URL}/${user?.photo?.replaceAll("\\", "/")}`;
  const url = `${config.REACT_APP_SERVER_URL}/api/post/${user?.id}/posts`;
  const savedUrl = `${config.REACT_APP_SERVER_URL}/api/post/${user?.id}/savedPosts`;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await sendRequest(url, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const responseSaved = await sendRequest(savedUrl, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        setUserPosts(response);
        setSavedPosts(responseSaved);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };


    fetchPosts();
  }, [sendRequest, url, token]);

  function gotoSettings() {
    navigate("/settings");
  }

  async function editUserDetails() {
    // Implement edit user details logic here
  }

  async function onEditSubmit(postId: string, updatedPost: { caption: string; tags: string[]; location: string }) {
    const updatePostUrl = `${config.REACT_APP_SERVER_URL}/api/post/${postId}`;
    
    try {
      const response = await sendRequest(updatePostUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
      });

      if (response.message) {
        setMessageModalContent({
          type: 'success',
          message: 'Post updated successfully!'
        });
        setUserPosts((prevPosts: any) => prevPosts.map((post: any) =>
          post._id === postId ? { ...post, ...updatedPost } : post
        ));
        setEditingPostId(null);
      } else {
        setMessageModalContent({
          type: 'error',
          message: 'Failed to update post. Please try again.'
        });
      }
    } catch (error) {
      setMessageModalContent({
        type: 'error',
        message: 'An error occurred while updating the post.'
      });
    }
    setShowMessageModal(true);
  }

  async function onDeleteClicked() {
    if (!selectedPost) return;
    const deletePostUrl = `${config.REACT_APP_SERVER_URL}/api/post/${selectedPost._id}`;
    try {
      const response = await sendRequest(deletePostUrl, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (response.message) {
        setMessageModalContent({
          type: 'success',
          message: 'Post deleted successfully!'
        });
        setUserPosts(prevPosts => prevPosts.filter((post: any) => post._id !== selectedPost._id));
      } else {
        setMessageModalContent({
          type: 'error',
          message: 'Failed to delete post. Please try again.'
        });
      }
    } catch (error) {
      setMessageModalContent({
        type: 'error',
        message: 'An error occurred while deleting the post.'
      });
    }
    setShowMessageModal(true);
    setIsPopUpVisible(false);
    setSelectedPost(null);
  }

  async function onEditClicked(event: React.MouseEvent) {
    event.preventDefault();
    setEditingPostId(selectedPost._id); // Set the post to be edited
    setIsPopUpVisible(false); // Hide the popup during editing
  }

  function onPostClick(post: any) {
    if (editingPostId === post._id) {
      // Don't open the popup if this post is already being edited
      return;
    }
    setIsPopUpVisible(true);
    setSelectedPost(post); // Set the post related to the popup
  }

  return (
    <div className={`d-flex ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Sidebar />
      <div className={`flex-grow-1 p-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="d-flex flex-column align-items-center mb-4">
          <img
            src={photoUrl}
            alt="Profile"
            className="rounded-circle img-thumbnail mb-3"
            style={{ width: '150px', height: '150px' }}
          />
          <h2 className="fw-bold">{user?.username}</h2>
          <p className="text-muted">{user?.email}</p>
          <div className="d-flex gap-2">
            <button onClick={() => editUserDetails()} className="btn btn-outline-primary">Edit Profile</button>
            <button onClick={() => gotoSettings()} className="btn btn-outline-secondary">Settings</button>
          </div>
        </div>

        <div className="container">
          <div className="row row-cols-1 row-cols-md-3 g-4">
            <h1> your posts:</h1>
            {userPosts.map((post: any) => (
              <div className="col" key={post?._id} onClick={() => onPostClick(post)}>
                <Post 
                  post={post} 
                  edit={editingPostId === post?._id} 
                  onEditSubmit={(updatedPost: any) => onEditSubmit(post._id, updatedPost)} 
                />
              </div>
            ))}
          </div>
        </div>
        <h1>
          Saved Posts:
        </h1>
        {savedPosts.map((post: any) => (
              <div className="col" key={post?._id} onClick={() => onPostClick(post)}>
                <Post 
                  post={post} 
                  edit={false} 
                  onEditSubmit={null} 
                />
              </div>
            ))}
      </div>
      <PopUp 
        visible={isPopUpVisible && selectedPost} 
        setVisible={setIsPopUpVisible} 
        onDeleteClicked={onDeleteClicked} 
        onEditClicked={onEditClicked} 
      />
      <MessageModal
        show={showMessageModal}
        onHide={() => setShowMessageModal(false)}
        message={messageModalContent.message}
        type={messageModalContent.type as 'success' | 'error' | 'warning' | 'info'}
      />
    </div>
  );
};

export default Profile;
