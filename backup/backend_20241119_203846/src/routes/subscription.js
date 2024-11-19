const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

router.get('/status', auth, SubscriptionController.getStatus);
router.get('/vpn/config', auth, SubscriptionController.getVpnConfig);
router.delete('/vpn/revoke', auth, SubscriptionController.revokeVpnAccess);

module.exports = router; 