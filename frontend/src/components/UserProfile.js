import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import '../styles/UserProfile.css';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileResponse, statsResponse] = await Promise.all([
        fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${WebApp.initData}`
          }
        }),
        fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${WebApp.initData}`
          }
        })
      ]);

      const profileData = await profileResponse.json();
      const statsData = await statsResponse.json();

      setProfile(profileData);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных профиля:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h3>Профиль пользователя</h3>
        <div className="user-info">
          <div className="subscription-status">
            <span className={`status-badge ${profile?.subscription_active ? 'active' : 'inactive'}`}>
              {profile?.subscription_active ? 'Активна' : 'Неактивна'}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-label">Трафик за месяц</div>
          <div className="stat-value">{formatTraffic(stats?.monthlyTraffic || 0)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Дней до окончания</div>
          <div className="stat-value">{calculateDaysLeft(profile?.subscription_end)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Время использования</div>
          <div className="stat-value">{formatUptime(stats?.totalUptime || 0)}</div>
        </div>
      </div>

      <div className="connection-history">
        <h4>История подключений</h4>
        <div className="history-list">
          {stats?.connections?.map((connection, index) => (
            <div key={index} className="connection-item">
              <div className="connection-info">
                <span className="connection-server">{connection.server}</span>
                <span className="connection-date">
                  {new Date(connection.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="connection-duration">
                {formatDuration(connection.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTraffic(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function calculateDaysLeft(endDate) {
  if (!endDate) return 0;
  const end = new Date(endDate);
  const now = new Date();
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatUptime(minutes) {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч ${minutes % 60} мин`;
  const days = Math.floor(hours / 24);
  return `${days} д ${hours % 24} ч`;
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ч ${minutes % 60} мин`;
}

export default UserProfile; 