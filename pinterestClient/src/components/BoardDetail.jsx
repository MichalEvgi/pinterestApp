import React, { useEffect, useState } from 'react';
import { getBoardDetails } from '../services/api'; // Import the API function

const BoardDetails = ({ boardId }) => {
  const [board, setBoard] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const data = await getBoardDetails(boardId); // Use the imported API function
        setBoard(data.board);
        setImages(data.images); // Assume the API returns board details with associated images
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
                <img src={image.url} alt={image.description} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BoardDetails;
