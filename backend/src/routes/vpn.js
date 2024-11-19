const express = require('express');
const router = express.Router();
const { createVpnKey, deleteVpnKey, getAllKeys } = require('../controllers/vpnController');

// Определяем маршруты с функциями-обработчиками
router.get('/keys', getAllKeys);
router.post('/keys', createVpnKey);
router.delete('/keys/:keyId', deleteVpnKey);

module.exports = router; 