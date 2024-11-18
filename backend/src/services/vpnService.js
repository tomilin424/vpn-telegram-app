const axios = require('axios');
const User = require('../models/User');
const https = require('https');

class VPNService {
  constructor() {
    this.apiUrl = process.env.OUTLINE_API_URL;
    this.apiKey = process.env.OUTLINE_API_KEY;
    
    // Создаем instance axios с отключенной проверкой SSL
    this.client = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
  }

  async createConfig(userId) {
    try {
      // Создаем нового пользователя в Outline
      const response = await this.client.post(`${this.apiUrl}/access-keys`, {}, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const key = response.data;
      
      // Переименовываем ключ
      await this.client.put(
        `${this.apiUrl}/access-keys/${key.id}/name`,
        { name: `user_${userId}` },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      // Сохраняем данные пользователя
      await User.update(
        { 
          isActive: true,
          vpnAccessKey: key.id
        },
        { where: { telegramId: userId } }
      );

      return { 
        success: true, 
        accessUrl: key.accessUrl,
        keyId: key.id
      };
    } catch (error) {
      console.error('Error creating Outline access:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteConfig(userId) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (user?.vpnAccessKey) {
        // Удаляем ключ доступа в Outline
        await this.client.delete(`${this.apiUrl}/access-keys/${user.vpnAccessKey}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });
      }

      await User.update(
        { 
          isActive: false,
          vpnAccessKey: null
        },
        { where: { telegramId: userId } }
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting Outline access:', error);
      return { success: false, error: error.message };
    }
  }

  async getStatus(userId) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      
      let keyStatus = false;
      if (user?.vpnAccessKey) {
        // Проверяем существование ключа в Outline
        const response = await this.client.get(`${this.apiUrl}/access-keys`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        });
        
        const keys = response.data.accessKeys;
        keyStatus = keys.some(key => key.id === user.vpnAccessKey);
      }

      return {
        success: true,
        isActive: user?.isActive && keyStatus,
        subscriptionEndDate: user?.subscriptionEndDate
      };
    } catch (error) {
      console.error('Error checking VPN status:', error);
      return { success: false, error: error.message };
    }
  }

  async generateVpnConfig(userId) {
    return await this.createConfig(userId);
  }

  async revokeVpnAccess(userId) {
    return await this.deleteConfig(userId);
  }

  async checkVpnStatus(userId) {
    return await this.getStatus(userId);
  }
}

module.exports = new VPNService(); 