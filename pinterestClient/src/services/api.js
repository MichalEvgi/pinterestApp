// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; 

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const fetchFeed = async () => {
  const response = await axios.get(`${API_URL}/media`);
  return response.data;
};

export const getBoards = async () => {
  try {
    const response = await axios.get('/api/boards');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBoard = async (boardTitle) => {
  try {
    const response = await axios.post('/api/boards', {
      title: boardTitle,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBoardDetails = async (boardId) => {
  try {
    const response = await axios.get(`/api/boards/${boardId}`);
    return response.data;
  } catch (error) {
    throw error; 
  }
};

// Function to add a new picture to a board
export const addPictureToBoard = async (boardId, pictureData) => {
  try {
    const response = await axios.post(`/api/boards/${boardId}/pictures`, pictureData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const uploadMedia = async (mediaData) => {
//   const response = await axios.post(`${API_URL}/media`, mediaData);
//   return response.data;
// };

// export const deleteMedia = async (mediaId) => {
//   const response = await axios.delete(`${API_URL}/media/${mediaId}`);
//   return response.data;
// };
