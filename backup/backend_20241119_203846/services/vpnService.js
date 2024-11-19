const axios = require('axios');
const fs = require('fs');
const https = require('https');

class VPNService {
    constructor() {
        this.apiUrl = process.env.OUTLINE_API_URL;
        this.apiKey = process.env.OUTLINE_API_KEY;
        this.certPath = process.env.OUTLINE_API_CERT;

        // Настройка HTTPS агента с сертификатом
        this.httpsAgent = new https.Agent({
            rejectUnauthorized: false,
            cert: fs.readFileSync(this.certPath)
        });
    }

    async createVPNKey() {
        try {
            console.log('Creating VPN key...');
            console.log('API URL:', this.apiUrl);
            
            const response = await axios.post(
                `${this.apiUrl}/access-keys`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    httpsAgent: this.httpsAgent
                }
            );

            console.log('VPN key created successfully:', response.data);
            return response.data.accessUrl;
        } catch (error) {
            console.error('Error creating VPN key:', error);
            throw new Error('Failed to create VPN key');
        }
    }

    async deleteVPNKey(keyId) {
        try {
            await axios.delete(
                `${this.apiUrl}/access-keys/${keyId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    httpsAgent: this.httpsAgent
                }
            );
            return true;
        } catch (error) {
            console.error('Error deleting VPN key:', error);
            return false;
        }
    }
}

module.exports = new VPNService(); 