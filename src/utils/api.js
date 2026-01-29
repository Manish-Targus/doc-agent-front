import { NextResponse } from "next/server";

export const API_BASE_URL = 'http://192.168.1.245:9002';
// Cookie helper functions
export const getAuthToken = () => {
  if (typeof document !== 'undefined') {
    // Browser environment
    return getCookie('access_token');
  }
  return null;
};

export const setAuthToken = (token) => {
  if (typeof document !== 'undefined') {
    // Set cookie in browser
    document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
  }
};

export const removeAuthToken = () => {
  if (typeof document !== 'undefined') {
    // Remove cookie in browser
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  }
};

// Helper to get cookie by name
const getCookie = (name) => {
  if (typeof document !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  return null;
};

// Enhanced fetch with authentication
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Important for cookies
  };

  const response = await fetch(url, fetchOptions);
  
  // If unauthorized, try to refresh token or redirect to login
  if (response.status === 401) {
    removeAuthToken();
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  return response;
};

export const api = {
  upload: async (file, collectionName) => {
    const formData = new FormData();
    formData.append('files', file);
    const finalCollectionName = collectionName || file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_");
    formData.append('scope', 'default');
    formData.append('collection', finalCollectionName);
    formData.append('recreate', 'false');

    const token = getAuthToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }
    return response.json();
  },
  
  getCollections: async () => {
    const response = await authFetch(`${API_BASE_URL}/collections`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch collections');
    return response.json();
  },

  getBids: async ({page,byType,highBidValue,bidStatusType,byEndDate}) => {
    console.log({byEndDate})
    const url = new URL(`${API_BASE_URL}/gem-bids`);
    url.searchParams.append('page', page || 1);
    if(byType){
      url.searchParams.append('byType', byType);
    }
    if(highBidValue){
      url.searchParams.append('highBidValue', highBidValue);
    }
    if(bidStatusType){
      url.searchParams.append('bidStatusType', bidStatusType);
    }
    if(byEndDate?.from){

        url.searchParams.append('fromDate', JSON.stringify(byEndDate.from));
    }
    if(byEndDate?.to){
        url.searchParams.append('toDate', JSON.stringify(byEndDate.to));
    }
    const response = await authFetch(url, {
      method: 'GET',
    });
    
    if (!response.ok) throw new Error('Failed to fetch bids');
    return response.json();
  },

   getUserList: async () => {

    const url = new URL(`${API_BASE_URL}/all-users`);
    // url.searchParams.append('page', page || 1);
    
    const response = await authFetch(url, {
      method: 'GET',
    });
    console.log({response})
    if(response.status==403){
     Swal.fire({
      icon: 'error',
      title: 'Access Denied',
      text: 'You do not have permission to access this resource.',
    }).then(() => {
window.location.href = '/';    });
    if (!response.ok) throw new Error('Failed to fetch Users');
    return response.json();
  }
  return response.json();
},
  updateUser: async ({data}) => {
    const url = new URL(`${API_BASE_URL}/update/${data.id}`);
    
    const response = await authFetch(url, {
      method: 'PATCH',
      body: JSON.stringify({
        id: data.id,
        update_data: data.updatedData
      }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch bids');
    return response.json();
  },
  getCollectionInfo: async (name) => {
    const response = await authFetch(`${API_BASE_URL}/collection/${name}`, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Failed to fetch collection info');
    return response.json();
  },
  
  deleteCollection: async (name) => {
    const response = await authFetch(`${API_BASE_URL}/collection/${name}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
    return response.json();
  },
  
  chat: async (query, collectionName, k = 6, scope = "default", history = []) => {
    const response = await authFetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      body: JSON.stringify({
        query,
        k,
        scope,
        collection: collectionName,
        history
      }),
    });
    if (!response.ok) throw new Error('Chat failed');
    return response.json();
  },
  
  generateRfpSummary: async (collectionName) => {
    const response = await authFetch(`${API_BASE_URL}/generate_rfp_summary`, {
      method: 'POST',
      body: JSON.stringify({ 
        collection: collectionName,  
        query: "Generate summary"
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Summary generation failed: ${errorText}`);
    }

    // Get the blob from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RFP_Summary_${collectionName || 'generated'}.xlsx`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true, message: 'File downloaded successfully' };
  },
  
  search: async (query, collectionName) => {
    const url = new URL(`${API_BASE_URL}/search`);
    url.searchParams.append('query', query);
    if (collectionName) url.searchParams.append('collection_name', collectionName);

    const response = await authFetch(url, {
      method: 'GET',
    });
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },
  
  registerUser: async (body) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed: ${errorText}`);
    }
    return response.json();
  },
    changeUserStatus: async (body) => {
      console.log(body)
    const response = await fetch(`${API_BASE_URL}/change-status/${body.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status Change failed: ${errorText}`);
    }
    return response.json();
  },
    deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status Change failed: ${errorText}`);
    }
    return response.json();
  },
  
  loginUser: async (body) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    console.log('Login response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      
      // Store token from response if provided
      if (data.access_token) {
        setAuthToken(data.access_token);
      }
      
      // Also check for cookie in response
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        console.log('Cookies set by server:', cookies);
      }
      
      window.location.href = '/';
      return data;
    } else {
      const errorText = await response.text();
      throw new Error(`Login failed: ${errorText}`);
    }
  },
  
  logoutUser: async () => {
    const response = await authFetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
    });
    
    removeAuthToken();
    
    if (response.ok) {
      window.location.href = '/login';
      return { message: 'Logged out successfully' };
    } else {
      const errorText = await response.text();
      throw new Error(`Logout failed: ${errorText}`);
    }
  },
  
  getProfile: async () => {
    const response = await authFetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
    });
    
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },
  updateProfile: async (profileData) => {
    const response = await authFetch(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });

    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },
  checkAuth: async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/api/me`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};
uploadPDF: async (body) => {
    const response = await authFetch(`${API_BASE_URL}/pdf/process`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PDF upload failed: ${errorText}`);
    }
    return response.json();
  }
// Alternative: Axios-based implementation (if you prefer)
import axios from 'axios';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export axios-based methods
export const axiosApi = {
  getBids: (params) => axiosInstance.get('/gem-bids', { params }),
  getCollections: () => axiosInstance.get('/collections'),
  login: (data) => axiosInstance.post('/login', data),
  uploadPDF: (data) => axiosInstance.post('/pdf/process', data),
  // ... other methods
};