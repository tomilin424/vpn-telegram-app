const express = require('express');
const router = express.Router();
const vpnController = require('../controllers/vpnController');
const auth = require('../middleware/auth');

router.get('/status', auth, vpnController.getStatus);
router.post('/connect', auth, vpnController.connect);
router.post('/disconnect', auth, vpnController.disconnect);

module.exports = router; 