import React, { useEffect } from 'react';
import './App.css';
import VPNControl from './components/VPNControl';

function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ZeusVPN</h1>
        <VPNControl />
      </header>
    </div>
  );
}

export default App;

