const express = require('express');
const router = express.Router();
const vpnController = require('../controllers/vpnController');
const auth = require('../middleware/auth');

router.post('/connect', auth, vpnController.connect);
router.post('/disconnect', auth, vpnController.disconnect);
router.get('/status', auth, vpnController.status);
router.get('/servers', auth, vpnController.getServers);

module.exports = router; 