import React, { useState } from 'react';
import WebApp from '@twa-dev/sdk';
import InstallGuide from './InstallGuide';

function VPNConfigModal({ config, onClose }) {
  const [platform, setPlatform] = useState('android');
  const [showGuide, setShowGuide] = useState(false);

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(config)
      .then(() => {
        WebApp.showAlert('Конфигурация скопирована в буфер обмена');
      })
      .catch(() => {
        WebApp.showAlert('Ошибка при копировании конфигурации');
      });
  };

  const handleDownloadConfig = () => {
    const blob = new Blob([config], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vpn-config.conf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="vpn-config-modal">
      <h3>VPN Конфигурация</h3>
      <pre className="config-text">{config}</pre>
      <div className="config-actions">
        <button onClick={handleCopyConfig} className="config-button copy">
          Скопировать
        </button>
        <button onClick={handleDownloadConfig} className="config-button download">
          Скачать
        </button>
        <button onClick={() => setShowGuide(!showGuide)} className="config-button guide">
          {showGuide ? 'Скрыть инструкцию' : 'Показать инструкцию'}
        </button>
      </div>
      
      {showGuide && (
        <InstallGuide platform={platform} onPlatformChange={setPlatform} />
      )}
      
      <button onClick={onClose} className="config-button close">
        Закрыть
      </button>
    </div>
  );
}

export default VPNConfigModal; 