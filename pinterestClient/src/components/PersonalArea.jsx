import React, { useState } from 'react';
import '../css/PersonalArea.css'; 

const PersonalArea = () => {
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: 'רקעים',
      media: [
        { id: 1, url: 'media1.jpg' },
        { id: 2, url: 'media2.jpg' },
        { id: 3, url: 'media3.jpg' },
      ],
    },
    {
      id: 2,
      title: 'makeup',
      media: [
        { id: 1, url: 'makeup1.jpg' },
        { id: 2, url: 'makeup2.jpg' },
        { id: 3, url: 'makeup3.jpg' },
      ],
    },
    {
      id: 3,
      title: 'קשקושים',
      media: [
        { id: 1, url: 'doodles1.jpg' },
        { id: 2, url: 'doodles2.jpg' },
        { id: 3, url: 'doodles3.jpg' },
      ],
    },
    {
      id: 4,
      title: 'nails',
      media: [
        { id: 1, url: 'nails1.jpg' },
        { id: 2, url: 'nails2.jpg' },
        { id: 3, url: 'nails3.jpg' },
      ],
    },
  ]);

  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [showAddBoard, setShowAddBoard] = useState(false);

  const handleAddBoard = () => {
    setShowAddBoard(true);
  };

  const handleSaveNewBoard = () => {
    if (newBoardTitle.trim()) {
      const newBoard = {
        id: boards.length + 1,
        title: newBoardTitle,
        media: [],
      };
      setBoards([...boards, newBoard]);
      setNewBoardTitle('');
      setShowAddBoard(false);
    }
  };

  const handleBoardClick = (boardId) => {
    // Logic to navigate to the board detail page or open a modal with board's media
    alert(`Open board with ID: ${boardId}`);
  };

  return (
    <div className="personal-area">
      <div className="boards-container">
        {boards.map((board) => (
          <div key={board.id} className="board-item" onClick={() => handleBoardClick(board.id)}>
            <div className="board-thumbnail">
              {board.media.slice(0, 3).map((media, index) => (
                <img key={index} src={media.url} alt={board.title} className="thumbnail-image" />
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
          <button onClick={handleSaveNewBoard} className="save-board-button">
            Save Board
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalArea;
