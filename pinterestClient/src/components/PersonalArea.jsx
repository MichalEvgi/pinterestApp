import React, { useState, useEffect } from 'react';
import { getBoards, addBoard, deleteBoard } from '../services/api'; 
import '../css/PersonalArea.css'; 
import BoardDetails from './BoardDetail';

const PersonalArea = () => {
  const [boards, setBoards] = useState([]); 
  const [newBoardTitle, setNewBoardTitle] = useState(''); 
  const [showAddBoard, setShowAddBoard] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const [selectedBoard, setSelectedBoard] = useState(null); 
  const [error, setError] = useState(null); 
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  
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
        const newBoard = await addBoard(newBoardTitle , currentUser.id); 
        newBoard.media  = [];
        setBoards([...boards, newBoard]); // Append new board to the existing list
        setNewBoardTitle('');
        setShowAddBoard(false);
      } catch (err) {
        setError('Failed to add new board. Please try again.');
      }
    }
  };

  // Handle click on a board to view details
  const handleBoardClick = (board) => {
    setSelectedBoard(board);
  };

  const handleCloseBoard = () => {
    setSelectedBoard(null); // Close the board
  };

  const handleDeleteBoard = async (boardId) => {
    try{
      await deleteBoard(boardId);
      setBoards(boards.filter((b) => b.id!== boardId)); // Remove deleted board from the list
    }
    catch (err) {
      setError('Failed to delete board. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="personal-area">
      <h1>My Boards</h1>
      <div className="boards-container">
        {Array.isArray(boards) && boards.map((board) => (
          <div
            key={board.id}
            className="board-item"
            onClick={() => handleBoardClick(board)}
          >
            <div className="delete-icon" onClick={(e) => {
              e.stopPropagation(); // Prevents board click event
              handleDeleteBoard(board.id);
            }}>🗑️</div>
            <div className="board-thumbnail">
              { board.media.slice(0, 1).map((media, index) => (
                <img
                  key={index}
                  src={"http://localhost:3000/"+media.media_url}
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
      {selectedBoard && (<BoardDetails board={selectedBoard} onClose={handleCloseBoard} mediaUrl={"http://localhost:3000/"} />)}
      {currentUser.role === 'creator' && (
      <div className="my-media-section">
        <h1>My Media</h1>
        {/* Implementation for displaying user's media */}
      </div>
)}
    </div>
  );
};

export default PersonalArea;
