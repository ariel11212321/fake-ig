import React, { useCallback, useEffect, useState } from 'react';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import useHttp from '../../hooks/useHttp';
import { useTheme } from '../../contexts/AppThemeContext';
import { motion } from 'framer-motion';

export default function AddPost() {
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const { user } = useUser();
  const { sendRequest } = useHttp();
  const { token, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated) {
      navigate("/");
    }
  }, []);

  const handlePostSubmit = async () => {
    const url = config.REACT_APP_SERVER_URL + "/api/posts";
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('location', location);
      formData.append('tags', tags);
      if(user != null) {
        formData.append('createdBy', user.id);
      }
      if (image) {
        formData.append('image', image);
      }
      const response = await sendRequest(url, {
        method: 'POST',
        body: formData,
        headers: {'Authorization': 'Bearer ' + token}
      });
      if (response.ok) {
        navigate("/home");  
        console.log('Post added successfully');
      } else {
        console.error('Failed to add post');
      }
    } catch (err) {
      console.error('Failed to add post', err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <h1 className="text-3xl font-bold mb-8 text-center">Add New Post</h1>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="caption" className="block text-sm font-medium mb-1">
                  Caption
                </label>
                <textarea
                  id="caption"
                  rows={3}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add location (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <motion.button
                type="submit"
                onClick={handlePostSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}