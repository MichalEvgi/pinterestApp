import React, { useState, useEffect } from 'react';
import '../css/MediaDisplay.css'; 
import { addPictureToBoard, getBoards } from '../services/api'; // Import necessary API functions

const MediaDisplay = ({ media, onClose, userId, mediaUrl }) => { // Accept userId as a prop
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [boards, setBoards] = useState([]); // State to store user's boards
  const [selectedBoardId, setSelectedBoardId] = useState(''); // State to store selected board ID

  useEffect(() => {
    // Fetch user's boards when the component mounts
    const fetchBoards = async () => {
      try {
        const fetchedBoards = await getBoards(userId); // Pass userId to fetch boards
        setBoards(fetchedBoards);
        if (fetchedBoards.length > 0) {
          setSelectedBoardId(fetchedBoards[0].id); // Set default selected board to the first one
        }
      } catch (error) {
        console.error('Failed to fetch boards', error);
        setError('Failed to load boards. Please try again later.');
      }
    };

    if (userId) {
      fetchBoards();
    }
  }, [userId]); // Re-run the effect when userId changes

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

  const handleSaveMedia = async () => {
    if (!selectedBoardId) {
      alert('Please select a board to save the media.');
      return;
    }

    try {
      // Make the API call to save the media to the selected board
      await addPictureToBoard(selectedBoardId, media.id);
      alert('Media saved to your board!');
    } catch (err) {
      console.error('Failed to save media to the board', err);
      setError('Failed to save media to the board. Please try again.');
    }
  };

  return (
    <div className="media-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        
        {/* Display media */}
        <div className="media-container">
          {media.media_type === 'video' ? (
            <video src={mediaUrl+media.media_url} controls className="media-element" />
          ) : (
            <img src={mediaUrl+media.media_url} alt={media.description} className="media-element" />
          )}
        </div>

        {/* Media description */}
        <div className="media-description">
          <h2>{media.title}</h2>
          <p>{media.description}</p>
        </div>

        {/* Display error if there is one */}
        {error && <div className="error-message">{error}</div>}

        {/* Dropdown to select board */}
        <div className="select-board">
          <label htmlFor="board-select">Select Board:</label>
          <select 
            id="board-select" 
            value={selectedBoardId} 
            onChange={(e) => setSelectedBoardId(e.target.value)}
          >
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.title}
              </option>
            ))}
          </select>
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
