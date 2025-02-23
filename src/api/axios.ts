import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:1337/api",
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
