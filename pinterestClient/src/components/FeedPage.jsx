import React, { useEffect, useState } from 'react';
import { fetchFeed } from '../services/api'; 
import MediaModal from './MediaDisplay'; 
import '../css/FeedPage.css'; 

const FeedPage = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null); 
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
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = mediaItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm) || 
      item.description.toLowerCase().includes(searchTerm)
    );
    
    setFilteredItems(filtered);
  };
  

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const handleCreateMedia = () => {
    window.location.href = '/create';
  };

  const goToPersonalArea = () => {
    window.location.href = '/personal-area';
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media); // Set the selected media to open the modal
  };

  const handleCloseModal = () => {
    setSelectedMedia(null); // Close the modal
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
          <div key={item.id} className="media-item" onClick={() => handleMediaClick(item)}>
            {item.media_type === 'video' ? (
              <video
                src={`http://localhost:3000/${item.media_url}`}
                className="media-img"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img src={`http://localhost:3000/${item.media_url}`} alt={item.description} className="media-img" />
            )}
          </div>
        ))}
      </div>

      {selectedMedia && (
        <MediaModal media={selectedMedia} onClose={handleCloseModal} userId={currentUser.id} mediaUrl={"http://localhost:3000/"}/>
      )}
    </div>
  );
};

export default FeedPage;
