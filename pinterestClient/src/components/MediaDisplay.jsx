import React, { useState } from 'react';
import '../css/MediaDisplay.css'; 

const MediaDisplay = ({ media, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  
  const handleLike = () => {
    setLiked(!liked);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  const handleSaveMedia = () => {
    // Logic to save media to a board in the personal area
    alert('Media saved to your board!');
  };

  return (
    <div className="media-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        
        {/* Display media */}
        <div className="media-container">
          {media.type === 'video' ? (
            <video src={media.url} controls className="media-element" />
          ) : (
            <img src={media.url} alt={media.description} className="media-element" />
          )}
        </div>

        {/* Media description */}
        <div className="media-description">
          <h2>{media.title}</h2>
          <p>{media.description}</p>
        </div>

        {/* Like, Save and Comment functionality */}
        <div className="media-actions">
          <button onClick={handleLike} className={`like-button ${liked ? 'liked' : ''}`}>
            {liked ? 'Unlike' : 'Like'}
          </button>
          <button onClick={handleSaveMedia} className="save-button">Save</button>
        </div>

        {/* Comment section */}
        <div className="comment-section">
          <h3>Comments</h3>
          <div className="comment-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">{comment}</div>
            ))}
          </div>
          <input 
            type="text" 
            value={comment} 
            onChange={handleCommentChange} 
            placeholder="Add a comment..." 
            className="comment-input" 
          />
          <button onClick={handleAddComment} className="add-comment-button">Add Comment</button>
        </div>
      </div>
    </div>
  );
};

export default MediaDisplay;
