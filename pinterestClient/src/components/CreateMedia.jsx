import React, { useState } from 'react';
import { uploadMedia } from '../services/api';
import '../css/CreateMedia.css';

const CreateMedia = () => {
  const [mediaFile, setMediaFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  const handleMediaUpload = (event) => {
    setMediaFile(event.target.files[0]);
  };
  const handleSave = async () => {
    console.log(mediaFile);
    if (mediaFile && title) {
      const formData = new FormData();
      formData.append('file', mediaFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('username',currentUser.username);
      formData.append('password', currentUser.password);
      
  
      try {
        await uploadMedia(formData);
        window.location.href = '/feed';
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed, please try again.');
      }
    } else {
      alert('Please provide a title and select a media file.');
    }
  };
  

  return (
    <div className="create-media-container">
      <h2>Create Pin</h2>
      <div className="create-media-form">
        <div className="media-upload">
          <input 
            type="file" 
            accept="image/*,video/*" 
            onChange={handleMediaUpload} 
          />
          {mediaFile ? (
            <p>{mediaFile.name}</p>
          ) : (
            <div className="upload-placeholder">
              <span>Select or drag a file and drop it here</span>
            </div>
          )}
        </div>
        <div className="input-group">
          <label>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Add a title" 
          />
        </div>
        <div className="input-group">
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Add a detailed description"
          />
        </div>
        <button onClick={handleSave} className="save-button">Save</button>
      </div>
    </div>
  );
};

export default CreateMedia;
