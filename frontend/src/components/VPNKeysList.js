import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, List, ListItem, Typography, Button, Paper, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

const VPNKeysList = () => {
    const [keys, setKeys] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const fetchKeys = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vpn/keys`);
            setKeys(response.data.accessKeys || []);
        } catch (error) {
            console.error('Error fetching keys:', error);
            setSnackbar({ open: true, message: 'Ошибка при загрузке ключей' });
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSnackbar({ open: true, message: 'Ключ скопирован в буфер обмена' });
    };

    const deleteKey = async (keyId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/vpn/keys/${keyId}`);
            fetchKeys();
            setSnackbar({ open: true, message: 'Ключ успешно удален' });
        } catch (error) {
            console.error('Error deleting key:', error);
            setSnackbar({ open: true, message: 'Ошибка при удалении ключа' });
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                VPN Ключи
            </Typography>
            <List>
                {keys.map((key) => (
                    <Paper key={key.id} sx={{ mb: 2, p: 2 }}>
                        <ListItem
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                ID: {key.id} {key.name && `(${key.name})`}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    wordBreak: 'break-all',
                                    mb: 2,
                                    fontFamily: 'monospace',
                                    bgcolor: 'grey.100',
                                    p: 1,
                                    borderRadius: 1,
                                    width: '100%'
                                }}
                            >
                                {key.accessUrl}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    startIcon={<ContentCopyIcon />}
                                    variant="contained"
                                    onClick={() => copyToClipboard(key.accessUrl)}
                                >
                                    Копировать
                                </Button>
                                <Button
                                    startIcon={<DeleteIcon />}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => deleteKey(key.id)}
                                >
                                    Удалить
                                </Button>
                            </Box>
                        </ListItem>
                    </Paper>
                ))}
            </List>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />
        </Box>
    );
};

export default VPNKeysList; 