// Set this to your actual Backend API URL (e.g., http://localhost:8080/api)
const BASE_URL = 'http://localhost:8080/api';


export const api = {
    async get(endpoint: string) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                }
            });
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    async post(endpoint: string, data: any) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Post error:', error);
            throw error;
        }
    }
};
