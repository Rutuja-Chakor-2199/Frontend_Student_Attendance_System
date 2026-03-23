import axios from 'axios';

// Optimized API configuration with better caching and error handling
const currentHost = window.location.hostname;
const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
const isVercelHost = currentHost.endsWith('.vercel.app');

const productionFallbackApiUrl = isVercelHost
    ? '/api'
    : 'https://student-attendance-backend-groy.onrender.com/api';
const defaultApiUrl = isLocalhost
    ? 'http://localhost:5000/api'
    : productionFallbackApiUrl;
const rawApiUrl = (import.meta.env.VITE_API_URL || defaultApiUrl).trim();

function normalizeApiUrl(url) {
    const clean = (url || '').replace(/\/+$/, '');
    if (!clean) return '/api';
    if (clean === '/api') return clean;
    if (clean.startsWith('/api/')) return '/api';

    const apiPrefixMatch = clean.match(/^(.*\/api)(?:\/.*)?$/i);
    if (apiPrefixMatch) return apiPrefixMatch[1];

    return `${clean}/api`;
}

const API_URL = normalizeApiUrl(rawApiUrl);

// Enhanced axios instance with better defaults
const API = axios.create({
    baseURL: API_URL,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
    }
});

// Request interceptor with better error handling
API.interceptors.request.use(
    (req) => {
        // Add token if available
        const token = localStorage.getItem('token');
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request timestamp for debugging
        req.metadata = { startTime: new Date() };
        
        return req;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with enhanced error handling
API.interceptors.response.use(
    (response) => {
        // Log request duration for performance monitoring
        const duration = new Date() - response.config.metadata?.startTime;
        if (duration > 5000) {
            console.warn(`Slow API request: ${duration}ms to ${response.config.url}`);
        }
        
        return response;
    },
    (error) => {
        // Enhanced error logging
        const errorInfo = {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
            timestamp: new Date().toISOString()
        };
        
        console.error('API Error:', errorInfo);
        
        // Handle specific error cases
        if (error.code === 'ECONNABORTED') {
            error.userMessage = 'Request timed out. Please try again.';
        } else if (error.response?.status === 401) {
            error.userMessage = 'Session expired. Please login again.';
            // Clear invalid token
            localStorage.removeItem('token');
        } else if (error.response?.status === 429) {
            error.userMessage = 'Too many requests. Please wait and try again.';
        } else if (error.response?.status >= 500) {
            error.userMessage = 'Server error. Please try again later.';
        } else {
            error.userMessage = error.response?.data?.message || error.response?.data?.error || 'Something went wrong.';
        }
        
        return Promise.reject(error);
    }
);

// API functions with better error handling
export const loginUser = (data) => API.post('/auth/login', data);

export const registerUser = (data) => API.post('/auth/register', data);

export const markAttendance = (data) => API.post('/mark_attendance', data);

export const registerStudentFace = (data) => API.post('/register', data);

export const registerStudent = registerStudentFace;

export const getStats = () => API.get('/stats');

export const getLogs = () => API.get('/attendance_log');

export const getHODDashboard = () => API.get('/dashboard/hod');

export const getStudentDashboard = () => API.get('/dashboard/student');

export const getStudentsList = () => API.get('/students');

export const applyLeave = (data) => API.post('/leave/apply', data);

export const getMyLeaves = () => API.get('/leave/my');

// Utility functions
export const getApiUrl = () => API_URL;
export const isApiHealthy = async () => {
    try {
        const response = await API.get('/health', { timeout: 5000 });
        return response.status === 200;
    } catch {
        return false;
    }
};

export default API;
