import React, { useState } from 'react';
import './VPNControl.css';

function VPNControl() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleVPN = async () => {
    setIsLoading(true);
    try {
      // Здесь будет логика подключения к VPN
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      setIsConnected(!isConnected);
    } catch (error) {
      console.error('VPN connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vpn-control">
      <button 
        className={`vpn-button ${isConnected ? 'connected' : 'disconnected'} ${isLoading ? 'loading' : ''}`}
        onClick={toggleVPN}
        disabled={isLoading}
      >
        {isLoading ? 'Подождите...' : isConnected ? 'Отключить' : 'Подключить'}
      </button>
      <div className="status-text">
        Статус: {isLoading ? 'Подключение...' : isConnected ? 'Подключено' : 'Отключено'}
      </div>
    </div>
  );
}

export default VPNControl;

