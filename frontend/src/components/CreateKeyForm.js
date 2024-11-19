import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CreateKeyForm = ({ onKeyCreated }) => {
    const [name, setName] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/vpn/keys`, { name });
            setName('');
            setSnackbar({ open: true, message: 'Ключ успешно создан' });
            if (onKeyCreated) onKeyCreated();
        } catch (error) {
            console.error('Error creating key:', error);
            setSnackbar({ open: true, message: 'Ошибка при создании ключа' });
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
            <Typography variant="h5" gutterBottom>
                Создать новый ключ
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <TextField
                        label="Имя ключа"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Создать
                    </Button>
                </Box>
            </form>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            />
        </Box>
    );
};

export default CreateKeyForm; 