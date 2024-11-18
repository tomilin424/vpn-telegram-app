const VPNService = require('../services/vpnService');
const User = require('../models/User');

class VPNController {
  async connect(req, res) {
    try {
      const { telegramId } = req.user;
      
      // Проверяем активную подписку
      const user = await User.findOne({ telegramId });
      if (!user || !user.subscription_active) {
        return res.status(403).json({ 
          message: 'Для подключения VPN требуется активная подписка' 
        });
      }

      // Генерируем конфигурацию VPN
      const vpnConfig = await VPNService.setupVPNConnection(telegramId);

      // Сохраняем информацию о подключении
      await User.updateOne(
        { telegramId },
        { vpn_connected: true, vpn_config: vpnConfig }
      );

      res.json({
        success: true,
        config: vpnConfig.config,
        connectionDetails: vpnConfig.connectionDetails
      });
    } catch (error) {
      console.error('Ошибка при подключении VPN:', error);
      res.status(500).json({ message: 'Ошибка при подключении VPN' });
    }
  }

  async disconnect(req, res) {
    try {
      const { telegramId } = req.user;
      
      // Отключаем VPN
      await VPNService.removeVPNConnection(telegramId);

      // Обновляем статус в базе
      await User.updateOne(
        { telegramId },
        { vpn_connected: false, vpn_config: null }
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Ошибка при отключении VPN:', error);
      res.status(500).json({ message: 'Ошибка при отключении VPN' });
    }
  }

  async status(req, res) {
    try {
      const { telegramId } = req.user;
      const user = await User.findOne({ telegramId });

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json({
        isConnected: user.vpn_connected || false,
        config: user.vpn_config
      });
    } catch (error) {
      console.error('Ошибка при получении статуса VPN:', error);
      res.status(500).json({ message: 'Ошибка при получении статуса VPN' });
    }
  }

  async getServers(req, res) {
    try {
      const servers = await VPNService.getAvailableServers();
      res.json(servers);
    } catch (error) {
      console.error('Ошибка при получении списка серверов:', error);
      res.status(500).json({ message: 'Ошибка при получении списка серверов' });
    }
  }
}

module.exports = new VPNController(); 