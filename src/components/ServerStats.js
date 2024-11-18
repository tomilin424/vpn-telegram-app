import React from 'react';
import './ServerStats.css';

const ServerStats = ({ stats }) => {
  return (
    <div className="server-stats">
      <h3>Статистика серверов</h3>
      <div className="servers-grid">
        {stats.servers.map((server, index) => (
          <div key={index} className="server-card">
            <div className="server-header">
              <span className="server-name">{server.location} {server.flag}</span>
              <span className={`server-status ${server.status}`}>
                {server.status === 'online' ? '🟢 Онлайн' : '🔴 Офлайн'}
              </span>
            </div>
            <div className="server-metrics">
              <div className="metric">
                <span className="metric-label">Нагрузка</span>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${server.load}%` }}
                  />
                </div>
                <span className="metric-value">{server.load}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Пользователей</span>
                <span className="metric-value">{server.activeUsers}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Трафик</span>
                <span className="metric-value">{formatTraffic(server.traffic)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatTraffic = (bytes) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export default ServerStats; 