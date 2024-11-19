const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');

class OutlineService {
    constructor() {
        try {
            const certPath = path.resolve(process.env.OUTLINE_API_CERT);
            console.log('Initializing OutlineService...');
            console.log('Cert path:', certPath);
            
            // Читаем содержимое файла access.txt
            const certFile = fs.readFileSync(certPath, 'utf8');
            
            // Извлекаем apiUrl из файла
            const apiUrlMatch = certFile.match(/apiUrl:(.*)/);
            const apiUrl = apiUrlMatch ? apiUrlMatch[1].trim() : null;
            
            console.log('Extracted API URL:', apiUrl);
            
            this.apiClient = axios.create({
                baseURL: apiUrl,
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 секунд таймаут
            });
            
            console.log('API client created successfully');
        } catch (error) {
            console.error('Error in constructor:', error);
            throw error;
        }
    }

    async getAllKeys() {
        try {
            console.log('Getting all keys...');
            const response = await this.apiClient.get('/access-keys');
            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting keys:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    }

    async createKey(name = '') {
        try {
            console.log('Creating new key...');
            const response = await this.apiClient.post('/access-keys');
            
            if (name && response.data.id) {
                console.log(`Setting name "${name}" for key ${response.data.id}...`);
                await this.apiClient.put(`/access-keys/${response.data.id}/name`, {
                    name: name
                });
                response.data.name = name;
            }
            
            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating key:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    }

    async deleteKey(keyId) {
        try {
            console.log(`Deleting key ${keyId}...`);
            const response = await this.apiClient.delete(`/access-keys/${keyId}`);
            console.log('Response:', response.data);
            return true;
        } catch (error) {
            console.error('Error deleting key:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    }
}

module.exports = new OutlineService(); 