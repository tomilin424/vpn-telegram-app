const { exec } = require('child_process');
const util = require('util');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const execAsync = util.promisify(exec);

class VPNService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.OUTLINE_API_URL,
      httpsAgent: new https.Agent({
        cert: fs.readFileSync(process.env.OUTLINE_API_CERT),
        rejectUnauthorized: false
      })
    });
  }

  async setupVPNConnection(telegramId) {
    try {
      // Создаем нового пользователя в Outline
      const response = await this.apiClient.post('/access-keys/', {
        name: `user_${telegramId}`
      });

      return {
        success: true,
        config: response.data.accessUrl,
        connectionDetails: {
          server: process.env.VPN_SERVER_IP,
          port: process.env.VPN_SERVER_PORT
        }
      };
    } catch (error) {
      console.error('Error setting up VPN:', error);
      throw new Error('Failed to setup VPN connection');
    }
  }

  async removeVPNConnection(telegramId) {
    try {
      // Получаем список ключей
      const keys = await this.apiClient.get('/access-keys/');
      const userKey = keys.data.find(k => k.name === `user_${telegramId}`);
      
      if (userKey) {
        await this.apiClient.delete(`/access-keys/${userKey.id}`);
      }
      return true;
    } catch (error) {
      console.error('Error removing VPN:', error);
      throw new Error('Failed to remove VPN connection');
    }
  }

  async checkStatus(telegramId) {
    try {
      const keys = await this.apiClient.get('/access-keys/');
      return keys.data.some(k => k.name === `user_${telegramId}`);
    } catch (error) {
      console.error('Error checking VPN status:', error);
      throw new Error('Failed to check VPN status');
    }
  }
}

module.exports = new VPNService(); 