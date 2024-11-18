import React from 'react';
import '../styles/InstallGuide.css';

function InstallGuide({ platform }) {
  const guides = {
    android: [
      'Установите Outline Client из Google Play Store',
      'Откройте полученную ссылку доступа',
      'Нажмите "Добавить сервер"',
      'Готово! Нажмите "Подключиться"'
    ],
    ios: [
      'Установите Outline Client из App Store',
      'Откройте полученную ссылку доступа',
      'Нажмите "Добавить сервер"',
      'Готово! Нажмите "Подключиться"'
    ],
    windows: [
      'Скачайте Outline Client с сайта getoutline.org/get-started',
      'Установите приложение',
      'Откройте полученную ссылку доступа',
      'Нажмите "Подключиться"'
    ]
  };

  return (
    <div className="install-guide">
      <h3>Инструкция по установке</h3>
      <div className="platform-selector">
        <button className={platform === 'android' ? 'active' : ''}>Android</button>
        <button className={platform === 'ios' ? 'active' : ''}>iOS</button>
        <button className={platform === 'windows' ? 'active' : ''}>Windows</button>
      </div>
      <div className="guide-steps">
        {guides[platform].map((step, index) => (
          <div key={index} className="step">
            <div className="step-number">{index + 1}</div>
            <div className="step-text">{step}</div>
          </div>
        ))}
      </div>
      <div className="download-links">
        <a href="https://play.google.com/store/apps/details?id=org.outline.android.client" target="_blank" rel="noopener noreferrer">Android</a>
        <a href="https://apps.apple.com/us/app/outline-app/id1356177741" target="_blank" rel="noopener noreferrer">iOS</a>
        <a href="https://raw.githubusercontent.com/Jigsaw-Code/outline-releases/master/client/stable/Outline-Client.exe" target="_blank" rel="noopener noreferrer">Windows</a>
      </div>
    </div>
  );
}

export default InstallGuide; 