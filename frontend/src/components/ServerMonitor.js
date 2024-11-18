import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import '../styles/ServerMonitor.css';

function ServerMonitor() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 30000); // Обновляем каждые 30 секунд
    return () => clearInterval(interval);
  }, []);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/vpn/servers', {
        headers: {
          'Authorization': `Bearer ${WebApp.initData}`
        }
      });
      const data = await response.json();
      setServers(data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении списка серверов:', error);
      setLoading(false);
    }
  };

  const getLoadColor = (load) => {
    if (load < 50) return '#4CAF50';
    if (load < 80) return '#FFC107';
    return '#f44336';
  };

  return (
    <div className="server-monitor">
      <h3>Статус серверов</h3>
      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="servers-list">
          {servers.map((server, index) => (
            <div key={index} className="server-item">
              <div className="server-info">
                <span className="server-location">{server.location}</span>
                <span className="server-address">{server.address}</span>
              </div>
              <div className="server-load">
                <div 
                  className="load-bar" 
                  style={{ 
                    width: `${server.load}%`,
                    backgroundColor: getLoadColor(server.load)
                  }} 
                />
                <span className="load-text">{server.load}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServerMonitor; 