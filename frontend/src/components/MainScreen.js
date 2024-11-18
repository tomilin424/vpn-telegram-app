import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import VPNConfigModal from './VPNConfigModal';

function MainScreen({ onNavigate }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [vpnConfig, setVpnConfig] = useState(null);

  useEffect(() => {
    checkSubscriptionStatus();
    checkVPNStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status', {
        headers: {
          'Authorization': `Bearer ${WebApp.initData}`
        }
      });
      const data = await response.json();
      setIsSubscribed(data.isActive);
    } catch (error) {
      console.error('Ошибка при проверке подписки:', error);
    }
  };

  const checkVPNStatus = async () => {
    try {
      const response = await fetch('/api/vpn/status', {
        headers: {
          'Authorization': `Bearer ${WebApp.initData}`
        }
      });
      const data = await response.json();
      setIsConnected(data.isConnected);
    } catch (error) {
      console.error('Ошибка при проверке статуса VPN:', error);
    }
  };

  const handleConnect = async () => {
    if (!isSubscribed) {
      WebApp.showPopup({
        message: 'Для использования VPN необходима подписка',
        buttons: [
          { 
            id: 'subscribe', 
            type: 'default', 
            text: 'Оформить подписку',
            onClick: () => onNavigate('subscription')
          }
        ]
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/vpn/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WebApp.initData}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setVpnConfig(data.config);
        setShowConfig(true);
      }
    } catch (error) {
      console.error('Ошибка при подключении VPN:', error);
      WebApp.showAlert('Ошибка при подключении VPN');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vpn/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WebApp.initData}`
        }
      });
      
      if (response.ok) {
        setIsConnected(false);
        WebApp.showAlert('VPN отключен');
      }
    } catch (error) {
      console.error('Ошибка при отключении VPN:', error);
      WebApp.showAlert('Ошибка при отключении VPN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-screen">
      <div className="logo">
        <img src="/images/logo.png" alt="Zeus VPN" />
      </div>

      <div className="status-indicator">
        <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
        <span>Статус: {isConnected ? 'Подключено' : 'Отключено'}</span>
      </div>

      <div className="actions">
        {!isSubscribed && (
          <button 
            onClick={() => onNavigate('subscription')} 
            className="button subscribe"
          >
            Оформить подписку
          </button>
        )}

        <button 
          onClick={isConnected ? handleDisconnect : handleConnect} 
          className={`button connect ${!isSubscribed ? 'disabled' : ''} ${isLoading ? 'loading' : ''}`}
          disabled={!isSubscribed || isLoading}
        >
          {isLoading ? 'Загрузка...' : isConnected ? 'Отключить' : 'Подключить'} VPN
        </button>

        <button 
          onClick={() => onNavigate('settings')} 
          className="button settings"
        >
          Настройки
        </button>
      </div>

      {showConfig && vpnConfig && (
        <VPNConfigModal 
          config={vpnConfig} 
          onClose={() => setShowConfig(false)} 
        />
      )}
    </div>
  );
}

export default MainScreen; 