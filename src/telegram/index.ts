import Telegraf from 'telegraf';
// eslint-disable-next-line no-unused-vars
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';

import { TelegramConfig } from './telegram.config';

export const bot = new Telegraf(TelegramConfig.TOKEN);

export function sendAdminMessage(text: string, extra?: ExtraEditMessage) {
  return bot.telegram.sendMessage(TelegramConfig.ADMIN_ID, `[ADMIN] ${text}`, extra);
}
