import React, { useState } from 'react';
import '../css/CreateMedia.css';

const CreateMedia = ({ onSaveMedia }) => {
  const [mediaFile, setMediaFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  
  const handleMediaUpload = (event) => {
    setMediaFile(event.target.files[0]);
  };

  const handleSave = () => {
    console.log(mediaFile);
    if (mediaFile && title) {
      const newMedia = {
        id: Date.now(), // generate a unique ID for the new media
        mediaFile,
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()), // convert comma-separated string to array
      };
      onSaveMedia(newMedia);
    } else {
      alert('Please provide a title and select a media file.');
    }
  };

  return (
    <div className="create-media-container">
      <h2>יצירת Pin</h2>
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
              <span>בחרו קובץ או גררו ושחררו אותו כאן</span>
            </div>
          )}
        </div>
        <div className="input-group">
          <label>כותרת</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="הוספת כותרת" 
          />
        </div>
        <div className="input-group">
          <label>תיאור</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="הוסיפו תיאור מפורט"
          />
        </div>
        <div className="input-group">
          <label>תגים</label>
          <input 
            type="text" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="הוסיפו תגים מופרדים בפסיקים"
          />
        </div>
        <button onClick={handleSave} className="save-button">שמור</button>
      </div>
    </div>
  );
};

export default CreateMedia;
