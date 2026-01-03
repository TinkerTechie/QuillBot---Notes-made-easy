import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Login failed';
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post('/auth/register', { name, email, password });
        if (response.data) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Registration failed';
    }
};

export const logoutUser = () => {
    localStorage.removeItem('userInfo');
};

export const getMe = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to get user profile';
    }
};

// AI Processing API
export const processText = async (text, mode) => {
    try {
        const response = await api.post('/ai/process', { text, mode });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'Failed to process text';
    }
};

// History API
export const getHistory = async () => {
    try {
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'Failed to fetch history';
    }
};

// Notes API
export const getNotes = async () => {
    try {
        const response = await api.get('/notes');
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'Failed to fetch notes';
    }
};

export const getNote = async (id) => {
    try {
        const response = await api.get(`/notes/${id}`);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'Failed to fetch note';
    }
};

export const createNote = async (noteData) => {
    try {
        const response = await api.post('/notes', noteData);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'Failed to create note';
    }
};

export const updateNote = async (id, noteData) => {
    try {
        const response = await api.put(`/notes/${id}`, noteData);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'Failed to update note';
    }
};

export const deleteNote = async (id) => {
    try {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'Failed to delete note';
    }
};
