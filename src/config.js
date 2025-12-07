// Dynamic API URL based on environment
// If on localhost, use local backend
// If deployed, use Render backend

const getApiUrl = () => {
    const hostname = window.location.hostname;

    // Development: localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001/api';
    }

    // Production: Render backend
    return 'https://meal-rescue-backend.onrender.com/api';
};

export const API_URL = getApiUrl();

console.log('API Base URL:', API_URL);
