import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  let friendlyMessage = "Something went wrong on our side. Please try again later.";
  
  if (!error.response) {
    friendlyMessage = "Unable to connect. Please check your internet connection.";
  } else {
    const status = error.response.status;
    if (status === 401) {
      friendlyMessage = "Your session has expired. Please log in again.";
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page to avoid loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      friendlyMessage = "You don't have permission to perform this action.";
    } else if (status === 404) {
      friendlyMessage = "We couldn't find what you're looking for.";
    } else if (status === 409) {
      friendlyMessage = "This action conflicts with the current state. Please refresh and try again.";
    } else if (status === 429) {
      friendlyMessage = "Too many attempts. Please wait a moment and try again.";
    } else if (status === 400) {
      friendlyMessage = "Please check the highlighted fields or your input.";
    }
  }

  // Attach the friendly message to the error object so components can use it
  error.friendlyMessage = friendlyMessage;
  return Promise.reject(error);
});

export default api;
