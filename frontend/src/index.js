import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Инициализация Telegram Mini App
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 