import React, { useState, useEffect } from 'react';
import { getBoards, addBoard } from '../services/api'; 
import '../css/PersonalArea.css'; 
import BoardDetails from './BoardDetail';

const PersonalArea = () => {
  const [boards, setBoards] = useState([]); // State to store boards
  const [newBoardTitle, setNewBoardTitle] = useState(''); // State for new board title
  const [showAddBoard, setShowAddBoard] = useState(false); // State to show/hide add board form
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [selectedBoardId, setSelectedBoardId] = useState(null); 
  const [error, setError] = useState(null); // State to manage errors
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Fetch boards from the server when the component mounts
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoards(currentUser.id);
        setBoards(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load boards. Please try again.');
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  // Handle adding a new board
  const handleAddBoard = () => {
    setShowAddBoard(true);
  };

  // Handle saving the new board
  const handleSaveNewBoard = async () => {
    if (newBoardTitle.trim()) {
      try {
        const newBoard = await addBoard(newBoardTitle , currentUser.id); // Use addBoard from api.js
        setBoards([...boards, newBoard]); // Append new board to the existing list
        setNewBoardTitle('');
        setShowAddBoard(false);
      } catch (err) {
        setError('Failed to add new board. Please try again.');
      }
    }
  };

  // Handle click on a board to view details
  const handleBoardClick = (boardId) => {
    setSelectedBoardId(boardId);
    alert(`Open board with ID: ${boardId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="personal-area">
      {selectedBoardId && <BoardDetails boardId={selectedBoardId} />}
      <h1>My Boards</h1>
      <div className="boards-container">
        {Array.isArray(boards) && boards.map((board) => (
          <div
            key={board.id}
            className="board-item"
            onClick={() => handleBoardClick(board.id)}
          >
            <div className="board-thumbnail">
              {false && board.media.slice(0, 3).map((media, index) => (
                <img
                  key={index}
                  src={media.url}
                  alt={board.title}
                  className="thumbnail-image"
                />
              ))}
            </div>
            <div className="board-title">{board.title}</div>
          </div>
        ))}
        <div className="add-board-item" onClick={handleAddBoard}>
          <div className="add-board-icon">+</div>
          <div className="add-board-text">Add New Board</div>
        </div>
      </div>
    
      {showAddBoard && (
        <div className="add-board-modal">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Enter board title"
            className="add-board-input"
          />
          <button onClick={handleSaveNewBoard}>Save</button>
          <button onClick={() => setShowAddBoard(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default PersonalArea;
