import React, { useEffect, useState } from 'react';
import { fetchFeed, logoutUser } from '../services/api'; // Adjust the path if needed
import './FeedPage.css'; // Importing the CSS file for styling

const FeedPage = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await fetchFeed();
        setMediaItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error('Failed to fetch media items', err);
      }
    };

    fetchMedia();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = mediaItems.filter((item) =>
      item.description.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleLogout = () => {
    logoutUser(); // Function to clear user data and redirect to login
    window.location.href = '/';
  };

  const handleCreateMedia = () => {
    window.location.href = '/create'; // Redirect to the create media page
  };

  const goToPersonalArea = () => {
    window.location.href = '/personal-area'; // Redirect to the personal area
  };

  return (
    <div className="feed-page">
      <div className="header">
        <button className="personal-area-button" onClick={goToPersonalArea}>
          Personal Area
        </button>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <div className="header-buttons">
          {currentUser?.role === 'creator' && (
            <button className="create-button" onClick={handleCreateMedia}>
              Create
            </button>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className="media-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="media-item">
            <img src={item.imageUrl} alt={item.description} className="media-img" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
