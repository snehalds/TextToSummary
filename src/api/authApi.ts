import axios from 'axios';

const API_URL = 'http://localhost:8050/auth/token';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(API_URL, {
      username,
      password,
    });

    const token = response.data.access_token;
    localStorage.setItem('token', token); 
    console.log('Login successful! Token:', token);
    return token;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
