import React, { useState, useEffect } from 'react';
import '../css/MediaDisplay.css'; 
import { addPictureToBoard, getBoards, getLikes, likePin, unlikePin, getIsUserLiked, getCommentsForPin, addCommentToPin} from '../services/api'; // Import necessary API functions

const MediaDisplay = ({ media, onClose, userId, mediaUrl }) => { 
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [boards, setBoards] = useState([]); 
  const [selectedBoardId, setSelectedBoardId] = useState(''); 
  const [likes, setLikes] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const fetchedBoards = await getBoards(userId); 
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

  useEffect(() => {
    const fetchLikes = async ()=>{
    try{
      const likesCount= await getLikes( media.id);
      setLikes(likesCount);
      const isUserLiked = await getIsUserLiked(media.id, userId);
      setLiked(isUserLiked);
    }
    catch(error){
      console.error('Failed to fetch likes', error);
      setError('Failed to load likes. Please try again later.');
    }
  }; fetchLikes();
  }, []);

  useEffect(() => {
    const fetchComments = async ()=>{
      try{
      const fetchedComments= await getCommentsForPin(media.id);
      setComments(fetchedComments);
    }
    catch(error){
      console.error('Failed to fetch comments', error);
      setError('Failed to load comments. Please try again later.');
    }
  }; fetchComments();
  }, []);


  const handleLike = () => {
    if(!liked){
      likePin(media.id, userId);
      setLikes(likes+1);
    }
    else{
      unlikePin(media.id, userId);
      setLikes(likes-1);
    }
    setLiked(!liked);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      const newComment = {
        content: comment,
        user_id: userId
      };
      try{
        const data = await addCommentToPin(media.id, newComment);
        setComments([...comments, data]);
        setComment('');
      }
      catch(error){
        console.error('Failed to add comment', error);
        setError('Failed to add comment. Please try again later.');
      }
    }
  };

  const handleSaveMedia = async () => {
    if (!selectedBoardId) {
      alert('Please select a board to save the media.');
      return;
    }

    try {
    
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
          <p>Likes: {likes}</p>
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
              <div key={index} className="comment-item"><div>{comment.username}: {comment.content}</div>
              <p>{new Date(comment.created_at).toLocaleString('en-US', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: 'numeric', 
                minute: 'numeric'
              })}</p>
              </div>
              
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
