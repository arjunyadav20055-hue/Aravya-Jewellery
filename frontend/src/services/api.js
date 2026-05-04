import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add token automatically to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user")); // ✅ matches AuthContext
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      // Prevent full page reload loop if we are already on the login page
      // Also prevent redirecting to /login if the error is from the login request itself
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
