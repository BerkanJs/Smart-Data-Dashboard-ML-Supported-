import axios from "axios";

// Backend API URL
const API_URL = "http://localhost:5000/api";


export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log('Backend response:', response); 
    return response.data;  
  } catch (error) {
    console.log('API error:', error.response);  
    throw error.response?.data || error.message;
  }
};


export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData); 
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
