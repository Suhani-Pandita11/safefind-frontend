import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => {
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);
    return axios.post(`${BASE_URL}/users/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
};

// Profile APIs
export const getProfile = () => api.get('/profile/me');
export const updateProfile = (data) => api.put('/profile/update', data);

// Missing Person APIs
export const reportMissing = (data) => api.post('/missing/report', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getMissingPersons = () => api.get('/missing/list');
export const getCase = (personId) => api.get(`/missing/case/${personId}`);

// Sighting APIs
export const uploadSighting = (data) => api.post('/sightings/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getSightings = (personId) => api.get(`/sightings/list/${personId}`);

// Notification APIs
export const getNearbyCases = () => api.get('/notifications/nearby-cases');
export const getWarnings = () => api.get('/notifications/warnings');
export const getSightingClusters = () => api.get('/notifications/sighting-clusters');

// Admin APIs
export const getAdminStats = () => api.get('/admin/stats');
export const getAllMissing = () => api.get('/admin/missing/all');
export const getHighPriority = () => api.get('/admin/missing/high-priority');
export const getAllSightings = () => api.get('/admin/sightings/all');
export const verifySighting = (sightingId) => api.put(`/admin/sightings/verify/${sightingId}`);
export const markSolved = (personId) => api.put(`/admin/missing/solve/${personId}`);
export const markUnsolved = (personId) => api.put(`/admin/missing/unsolve/${personId}`);

export default api;