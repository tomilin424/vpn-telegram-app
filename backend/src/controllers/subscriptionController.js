const vpnService = require('../services/vpnService');

class SubscriptionController {
  async getStatus(req, res) {
    try {
      const status = await vpnService.getStatus(req.user.telegramId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVpnConfig(req, res) {
    try {
      const config = await vpnService.generateVpnConfig(req.user.telegramId);
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async revokeVpnAccess(req, res) {
    try {
      const result = await vpnService.revokeVpnAccess(req.user.telegramId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SubscriptionController(); 