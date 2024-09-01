// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; 

export const login = async (credentials) => {
  const response = await axios.get(`${API_URL}/users/login`, {params : credentials});
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const fetchFeed = async () => {
  const response = await axios.get(`${API_URL}/pins`);
  return response.data;
};

export const getBoards = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/boards/user/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBoard = async (boardTitle ,id) => {
  try {
    const response = await axios.post(`${API_URL}/boards/user/${id}`, {
      title: boardTitle,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try{
    const response = await axios.delete(`${API_URL}/boards/${boardId}`);
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export const getBoardDetails = async (boardId) => {
  try {
    const response = await axios.get(`${API_URL}/pins/board/${boardId}`);
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export const addPictureToBoard = async (boardId, pinId) => {
  try {
    const response = await axios.post(`${API_URL}/boards/${boardId}`, {pinId});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePictureFromBoard = async (boardId, pinId) => {
  try {
    const response = await axios.delete(`${API_URL}/boards/${boardId}/pins/${pinId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

 export const uploadMedia = async (mediaData) => {
   const response = await axios.post(`${API_URL}/pins`, mediaData,{ headers: {
    'Content-Type': 'multipart/form-data'
  }});
   return response.data;
 };

 export const deleteMedia = async (pinId) => {
  try{
    const response = await axios.delete(`${API_URL}/pins/${pinId}`);
    return response.data;
  }
  catch (error) {
    throw error;
  }
 };

 export const getLikes = async (pinId) => {
   try {
    const response = await axios.get(`${API_URL}/pins/${pinId}/likes`);
    return response.data;
   } catch (error) {
    throw error;
   }
 };

 export const likePin = async (pinId, userId) => {
  try{
    const response = await axios.post(`${API_URL}/pins/${pinId}/like/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
   }
 }

 export const unlikePin = async (pinId, userId) => {
  try{
    const response = await axios.delete(`${API_URL}/pins/${pinId}/like/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
   }
 }

 export const getIsUserLiked = async (pinId, userId) => {
  try{
    const response = await axios.get(`${API_URL}/pins/${pinId}/like/user/${userId}`);
    if (response.data == 0)
      return false;
    else
      return true;
  } catch (error) {
    throw error;
   }
 }

 export const getCommentsForPin = async (pinId) => {
  try {
    const response = await axios.get(`${API_URL}/pins/${pinId}/comments`);
    return response.data;
  } catch (error) {
    throw error;
  }
 };

 export const addCommentToPin = async (pinId, comment) => {
  try {
    const response = await axios.post(`${API_URL}/pins/${pinId}/comment`, comment);
    return response.data;
  } catch (error) {
    throw error;
  }
 };

