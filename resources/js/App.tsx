import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import Routes from './Routes';
import { Provider } from 'react-redux';
import store from './store';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                outlined: {
                    background: 'white',
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    background: 'white',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    background: 'white',
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                outlined: {
                    background: 'white',
                },
            },
        },
    },
});

const container = document.getElementById('app');
const root: Root = createRoot(container ?? new HTMLDivElement());
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>
);
