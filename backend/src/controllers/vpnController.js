const outlineService = require('../services/outlineService');

const getAllKeys = async (req, res) => {
    try {
        const keys = await outlineService.getAllKeys();
        res.json(keys);
    } catch (error) {
        console.error('Error getting keys:', error);
        res.status(500).json({ error: 'Failed to get VPN keys' });
    }
};

const createVpnKey = async (req, res) => {
    try {
        const { name } = req.body;
        const newKey = await outlineService.createKey(name);
        res.json(newKey);
    } catch (error) {
        console.error('Error creating key:', error);
        res.status(500).json({ error: 'Failed to create VPN key' });
    }
};

const deleteVpnKey = async (req, res) => {
    try {
        const { keyId } = req.params;
        await outlineService.deleteKey(keyId);
        res.json({ message: 'Key deleted successfully' });
    } catch (error) {
        console.error('Error deleting key:', error);
        res.status(500).json({ error: 'Failed to delete VPN key' });
    }
};

module.exports = {
    getAllKeys,
    createVpnKey,
    deleteVpnKey
}; 