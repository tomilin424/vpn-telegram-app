import React from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      question: 'Как начать пользоваться VPN?',
      answer: '1. Оформите подписку\n2. Скачайте конфигурацию\n3. Импортируйте её в WireGuard\n4. Нажмите "Подключиться"'
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем оплату картой и в криптовалюте (USDT)'
    },
    {
      question: 'Какая скорость VPN?',
      answer: 'Мы предоставляем доступ к серверам со скоростью до 1 Гбит/с'
    },
    {
      question: 'Ведётся ли логирование?',
      answer: 'Нет, мы не храним логи пользовательской активности'
    }
  ];

  return (
    <div className="faq">
      <h2>Часто задаваемые вопросы</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 