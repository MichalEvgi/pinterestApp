import React, { useEffect, useState } from 'react';
import { fetchFeedWithOffset } from '../services/api';
import MediaModal from './MediaDisplay';
import '../css/FeedPage.css';
let ready = false;
const FeedPage = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  let startPin= 0;
  const [isLoading, setIsLoading] = useState(false);
  let hasMore = true;
  const offset = 10;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const fetchMedia = async (start = 0) => {
    try {
      setIsLoading(true);
      const data = await fetchFeedWithOffset(start, offset);
      setMediaItems((prevItems) => [...prevItems, ...data]);
      if (data.length < offset) {
        hasMore=false;
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch media items', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(ready){
      fetchMedia(0);
    }
    ready = true;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.scrollHeight &&
        !isLoading &&
        hasMore
      ) {
        
        startPin = startPin + offset;
        fetchMedia(startPin);
      }
    };
    const debouncedHandleScroll = debounce(handleScroll, 50);
    window.addEventListener('wheel', debouncedHandleScroll);

    return () => {
      window.removeEventListener('wheel', debouncedHandleScroll);
    };
  }, []);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = mediaItems.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(mediaItems);
    }
  }, [searchTerm, mediaItems]);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
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

      {isLoading && <div className="loading">Loading...</div>}

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={handleCloseModal}
          userId={currentUser.id}
          mediaUrl={"http://localhost:3000/"}
        />
      )}
    </div>
  );
};

export default FeedPage;
