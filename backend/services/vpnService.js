const axios = require('axios');
const fs = require('fs');
const https = require('https');

// Хранилище ключей пользователей
const userKeys = new Map();

class VPNService {
    constructor() {
        this.apiUrl = process.env.OUTLINE_API_URL;
        this.apiKey = process.env.OUTLINE_API_KEY;
        this.certPath = process.env.OUTLINE_API_CERT;
        this.maxDevices = 3;

        this.httpsAgent = new https.Agent({
            rejectUnauthorized: false,
            cert: fs.readFileSync(this.certPath)
        });
    }

    async createVPNKey(userId) {
        try {
            // Проверяем количество существующих ключей пользователя
            const userKeyCount = this.getUserKeyCount(userId);
            if (userKeyCount >= this.maxDevices) {
                throw new Error(`Достигнут лимит устройств (${this.maxDevices})`);
            }

            console.log('Creating VPN key...');
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

            const keyData = {
                keyId: response.data.id,
                accessUrl: response.data.accessUrl,
                createdAt: new Date(),
                userId: userId
            };

            // Сохраняем ключ в хранилище
            this.saveUserKey(userId, keyData);

            console.log('VPN key created successfully:', keyData);
            return keyData.accessUrl;
        } catch (error) {
            console.error('Error creating VPN key:', error);
            throw new Error(error.message || 'Failed to create VPN key');
        }
    }

    async deleteVPNKey(keyId, userId) {
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

            // Удаляем ключ из хранилища
            this.removeUserKey(userId, keyId);
            return true;
        } catch (error) {
            console.error('Error deleting VPN key:', error);
            return false;
        }
    }

    // Методы для работы с хранилищем ключей
    saveUserKey(userId, keyData) {
        if (!userKeys.has(userId)) {
            userKeys.set(userId, new Map());
        }
        userKeys.get(userId).set(keyData.keyId, keyData);
    }

    removeUserKey(userId, keyId) {
        if (userKeys.has(userId)) {
            userKeys.get(userId).delete(keyId);
        }
    }

    getUserKeys(userId) {
        return Array.from(userKeys.get(userId)?.values() || []);
    }

    getUserKeyCount(userId) {
        return userKeys.get(userId)?.size || 0;
    }

    async getUserActiveKeys(userId) {
        const keys = this.getUserKeys(userId);
        return keys.filter(key => {
            const keyAge = Date.now() - key.createdAt.getTime();
            const isActive = keyAge < 30 * 24 * 60 * 60 * 1000; // 30 дней
            return isActive;
        });
    }
}

module.exports = new VPNService(); 