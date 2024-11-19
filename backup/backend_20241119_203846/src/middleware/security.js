const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { randomBytes } = require('crypto');

// Создаем уникальный ключ для каждой сессии
const generateSessionKey = () => randomBytes(32).toString('hex');

// Лимитер запросов
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100 // максимум 100 запросов с одного IP
});

// Защита от спама в Telegram
const antiSpam = new Map();
const SPAM_INTERVAL = 2000; // 2 секунды между сообщениями
const SPAM_COUNT = 5; // максимум 5 сообщений подряд

const telegramAntiSpam = (chatId) => {
    const now = Date.now();
    const userSpam = antiSpam.get(chatId) || { count: 0, lastMessage: 0 };

    if (now - userSpam.lastMessage < SPAM_INTERVAL) {
        userSpam.count++;
    } else {
        userSpam.count = 1;
    }

    userSpam.lastMessage = now;
    antiSpam.set(chatId, userSpam);

    return userSpam.count > SPAM_COUNT;
};

// Проверка IP адреса
const ipWhitelist = new Set([
    '127.0.0.1',
    // Добавьте сюда IP адреса, которым разрешен доступ
]);

const checkIP = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (!ipWhitelist.has(ip)) {
        console.log(`Blocked request from unauthorized IP: ${ip}`);
        return res.status(403).json({ error: 'Unauthorized IP' });
    }
    next();
};

module.exports = {
    setupSecurity: (app) => {
        // Базовая защита
        app.use(helmet());
        app.use(limiter);
        
        // Защита от XSS
        app.use(helmet.xssFilter());
        
        // Защита от кликджекинга
        app.use(helmet.frameguard({ action: 'deny' }));
        
        // Отключаем информацию о сервере
        app.disable('x-powered-by');
        
        // Добавляем CORS защиту
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
    },
    telegramAntiSpam,
    checkIP,
    generateSessionKey
}; 