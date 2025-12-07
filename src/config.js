// Automatically determine the backend URL based on where the frontend is loaded from.
// If loaded from localhost, assume backend is at localhost:3001.
// If loaded from a network IP (e.g., 192.168.1.5), assume backend is at 192.168.1.5:3001.

export const API_URL = `${window.location.protocol}//${window.location.hostname}:3001/api`;

console.log('API Base URL:', API_URL);
