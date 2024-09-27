import React, { useState } from 'react';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import useHttp from '../../hooks/useHttp';
export default function AddPost() {

    const [image, setImage] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [location, setLocation] = useState('');
    const {user} = useUser();
    const {sendRequest} = useHttp();
    const {token} = useAuth();
    const navigate = useNavigate();


    const handlePostSubmit = async () => {
        const url = config.REACT_APP_SERVER_URL + "/api/post";
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
        <div className='d-flex'>
        <Sidebar />
        <div className="container mt-5">
            <h1 className="text-center">Add New Post</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form>
                  
                    <div className="form-group">
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

                       
                        <div className="mb-3">
                            <label htmlFor="caption" className="form-label">Caption</label>
                            <textarea
                                className="form-control"
                                id="caption"
                                rows={3}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                            ></textarea>
                        </div>

                        
                        <div className="mb-3">
                            <label htmlFor="tags" className="form-label">Tags</label>
                            <input
                                type="text"
                                className="form-control"
                                id="tags"
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Add tags (optional)"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Add location (optional)"
                            />
                        </div>

                  
                        <div className="d-grid">
                            <button onClick={() => handlePostSubmit()} type="submit" className="btn btn-primary">
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    );
}
