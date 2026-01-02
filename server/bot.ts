import { Telegraf } from 'telegraf';

// Example bot implementation
// To run this:
// 1. Set BOT_TOKEN env var
// 2. Set WEB_APP_URL env var (e.g. your replit dev url or production url)
// 3. Call startBot() from your server entry point or run this file separately

export function startBot() {
  const token = process.env.BOT_TOKEN;
  const webAppUrl = process.env.WEB_APP_URL;

  if (!token) {
    console.log('Skipping bot startup: BOT_TOKEN not set');
    return;
  }

  if (!webAppUrl) {
    console.log('Warning: WEB_APP_URL not set, button might not work correctly');
  }

  try {
    const bot = new Telegraf(token);

    bot.command('start', (ctx) => {
      ctx.reply('Benvenuto! Premi il pulsante qui sotto per aprire la Mini App.', {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Apri Lettore RSS", web_app: { url: webAppUrl || 'https://google.com' } }]
          ]
        }
      });
    });

    bot.launch().then(() => {
      console.log('Telegram Bot started successfully');
    }).catch((err) => {
      console.error('Failed to launch Telegram Bot:', err);
    });

    // Enable graceful stop
    const stopBot = (signal: string) => {
      bot.stop(signal);
    };
    
    // We don't want to capture process signals here if running inside another process that handles them,
    // but for standalone use it's good practice.
    // process.once('SIGINT', () => stopBot('SIGINT'));
    // process.once('SIGTERM', () => stopBot('SIGTERM'));
    
    return bot;
  } catch (error) {
    console.error('Error initializing bot:', error);
  }
}
