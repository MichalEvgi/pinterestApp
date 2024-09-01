import React, { useEffect, useState } from 'react';
import { getBoardDetails } from '../services/api';
import '../css/BoardDetail.css';

const BoardDetails = ({ board, onClose, mediaUrl }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const data = await getBoardDetails(board.id);
        setImages(data);
      } catch (error) {
        console.error('Failed to fetch board details', error);
        setError('Failed to load board details. Please try again.');
      }
    };

    fetchBoardDetails();
  }, [board.id]);

  const handleRemoveFromBoard = (imageId) => {
    // Placeholder for remove logic
    console.log('Remove image with ID:', imageId);
  };

  return (
    <div className="board-details-modal">
      <div className="modal-details-content">
        {error ? (
          <div>{error}</div>
        ) : (
          <>
            <span className="close-button" onClick={onClose}>&times;</span>
            {board && <h1>{board.title}</h1>}
            <div className="image-grid">
              {images.map((image) => (
                <div key={image.id} className="image-card">
                  {image.media_type === 'video' ? (
                    <video
                      src={mediaUrl + image.media_url}
                      className="media-img"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img src={mediaUrl + image.media_url} alt={image.description} className="media-img" />
                  )}
                  <div className="overlay">
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                    <button onClick={() => handleRemoveFromBoard(image.id)} className="remove-button">
                      Remove from Board
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BoardDetails;
