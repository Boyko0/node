'use strict';

const TelegramBot = require('node-telegram-bot-api');
const intervals = require(__dirname + '/src/intervals.js');
const gbScraper = require(__dirname + '/src/gb-scraper.js');
const messages = require(__dirname + '/src/messages.json');
const BOT_TOKEN = "702026635:AAEj0m2nghDXGnYS1T-laT9IaidJKdZu7bg";
const MILISECONDS_IN_ONE_HOUR = 3600000;
const intervalsObjects = [];

const sendResults = async (chatId, msgId) => {
  const result = `${await gbScraper(2147)}/${await gbScraper(2149)}`;
  if (msgId !== undefined) {
    bot.sendMessage(
      chatId,
      result,
      { reply_to_message_id: msgId }
    );
  } else {
    bot.sendMessage(chatId, result);
  }
};

intervals.start(sendResults);

const bot = new TelegramBot(BOT_TOKEN, {polling:true});


bot.onText(/\/now/, async msg => {
  sendResults(msg.chat.id, msg.message_id);
});

bot.onText(/\/every.+/, async msg => {
  const interval = parseFloat(msg.text.slice(7));
  if (!interval) {
    bot.sendMessage(msg.chat.id, messages.INCORRECT_INTERVAL);
  } else if (interval < 0.001) {
    bot.sendMessage(msg.chat.id, messages.TOO_BIG_INTERVAL);
  } else {
    bot.sendMessage(msg.chat.id, `Вы будете получать статусы проектов патио каждые ${interval} часов. Спасибо вам)`);
    intervals.update(msg.chat.id, interval);
  }
});

bot.onText(/\/stop.+/, msg => {
  const index = intervals.findIndex(([rowChatId]) => rowChatId === msg.chat.id);
  if (index > -1) {
    intervals.delete(index);
  }
  bot.sendMessage(msg.chat.id, messages.STOP_MAILING);
});
