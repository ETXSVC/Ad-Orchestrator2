import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;

// API endpoints
export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    getMe: () => apiClient.get('/auth/me'),
    register: (data) => apiClient.post('/auth/register', data)
};

export const campaignsAPI = {
    list: (params) => apiClient.get('/campaigns', { params }),
    get: (id) => apiClient.get(`/campaigns/${id}`),
    create: (data) => apiClient.post('/campaigns', data),
    update: (id, data) => apiClient.put(`/campaigns/${id}`, data),
    delete: (id) => apiClient.delete(`/campaigns/${id}`),
    archive: (id) => apiClient.patch(`/campaigns/${id}/archive`)
};

export const assetsAPI = {
    list: (params) => apiClient.get('/assets', { params }),
    get: (id) => apiClient.get(`/assets/${id}`),
    upload: (formData) => apiClient.post('/assets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => apiClient.put(`/assets/${id}`, data),
    delete: (id) => apiClient.delete(`/assets/${id}`),
    download: (id) => apiClient.get(`/assets/${id}/download`, { responseType: 'blob' })
};

export const usersAPI = {
    list: (params) => apiClient.get('/users', { params }),
    get: (id) => apiClient.get(`/users/${id}`),
    create: (data) => apiClient.post('/users', data),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`),
    updateStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status })
};

export const approvalsAPI = {
    getQueue: (params) => apiClient.get('/approvals/queue', { params }),
    create: (data) => apiClient.post('/approvals', data),
    approve: (id, comments) => apiClient.post(`/approvals/${id}/approve`, { comments }),
    reject: (id, data) => apiClient.post(`/approvals/${id}/reject`, data),
    bulkApprove: (approvalIds, comments) => apiClient.post('/approvals/bulk-approve', { approval_ids: approvalIds, comments }),
    getHistory: (id) => apiClient.get(`/approvals/${id}/history`)
};

export const aiAPI = {
    generateText: (data) => apiClient.post('/ai/generate/text', data),
    generateImage: (data) => apiClient.post('/ai/generate/image', data),
    getGeneration: (id) => apiClient.get(`/ai/generations/${id}`),
    save: (id, data) => apiClient.post(`/ai/save/${id}`, data)
};

export const dashboardAPI = {
    getStats: () => apiClient.get('/dashboard/stats'),
    getActivity: (limit) => apiClient.get('/dashboard/activity', { params: { limit } })
};
