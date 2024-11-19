import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import VPNKeysList from './components/VPNKeysList';
import CreateKeyForm from './components/CreateKeyForm';

const theme = createTheme({
    palette: {
        mode: 'light',
    },
});

function App() {
    const [refreshKeys, setRefreshKeys] = React.useState(0);

    const handleKeyCreated = () => {
        setRefreshKeys(prev => prev + 1);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container>
                <CreateKeyForm onKeyCreated={handleKeyCreated} />
                <VPNKeysList key={refreshKeys} />
            </Container>
        </ThemeProvider>
    );
}

export default App;

