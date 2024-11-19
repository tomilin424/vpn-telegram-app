const { Telegraf } = require('telegraf');
const vpnCommand = require('./commands/vpn');

class Bot {
  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.initCommands();
  }

  initCommands() {
    this.bot.command('start', (ctx) => ctx.reply(
      'Добро пожаловать в VPN бот!\n\n' +
      'Доступные команды:\n' +
      '/vpn - Получить доступ к VPN\n' +
      '/stop - Отключить VPN'
    ));
    
    this.bot.command('vpn', vpnCommand);
    
    this.bot.command('stop', async (ctx) => {
      const userId = ctx.from.id;
      const vpnService = require('../services/vpnService');
      
      try {
        const result = await vpnService.deleteConfig(userId);
        if (result.success) {
          await ctx.reply('✅ VPN успешно отключен');
        } else {
          await ctx.reply('❌ Ошибка при отключении VPN');
        }
      } catch (error) {
        console.error('Ошибка при отключении VPN:', error);
        await ctx.reply('Произошла ошибка. Попробуйте позже.');
      }
    });
  }

  launch() {
    this.bot.launch();
    console.log('Бот запущен');
  }
}

module.exports = new Bot(); 