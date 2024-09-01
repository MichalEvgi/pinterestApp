import React, { useEffect, useState } from 'react';
import { getBoardDetails } from '../services/api'; // Import the API function

const BoardDetails = ({ boardId , mediaUrl }) => {
  const [board, setBoard] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const data = await getBoardDetails(boardId); // Use the imported API function
        //setBoard(data.board);
        setImages(data); // Assume the API returns board details with associated images
      } catch (error) {
        console.error('Failed to fetch board details', error);
        setError('Failed to load board details. Please try again.');
      }
    };

    fetchBoardDetails();
  }, [boardId]);

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          {board && <h1>{board.title}</h1>}
          <div className="image-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                 {image.media_type === 'video' ? (
                  <video src={mediaUrl+image.media_url} controls className="media-element" />
                    ) : (
                  <img src={mediaUrl+image.media_url} alt={image.description} className="media-element" />
                   )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BoardDetails;
