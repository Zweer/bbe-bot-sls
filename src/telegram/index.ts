import Telegraf from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import Stage from 'telegraf/stage';
import WizardScene from 'telegraf/scenes/wizard';
import DynamoDBSession from 'telegraf-session-dynamodb';

import { TelegramConfig } from './telegram.config';

export const bot = new Telegraf(TelegramConfig.TOKEN);

const dynamoDBSession = new DynamoDBSession({
  dynamoDBConfig: {
    params: {
      TableName: process.env.DYNAMODB_TABLE_TELEGRAF_SESSIONS,
    },
    region: process.env.AWS_REGION,
  },
});
bot.use(dynamoDBSession.middleware());

const startWizard = new WizardScene(
  'start-wizard',
  async (ctx) => {
    ctx.wizard.state.data = {};
    await ctx.reply('What\'s your email address?');

    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.data.email = ctx.message.text;
    await ctx.reply('Enter your password');

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { email } = ctx.wizard.state.data;
    const password = ctx.message.text;

    const user = Object.assign(new User(), { username, email, password });

    let message;
    try {
      await user.login();
      message = 'Credentials validated';

      await mapper.put(user);
    } catch (error) {
      console.error(error);

      message = 'Error trying to validate credentials';
    }

    await ctx.reply(message);

    return ctx.scene.leave();
  },
);

const stage = new Stage([startWizard]);
bot.use(stage.middleware());

export function sendAdminMessage(text: string, extra?: ExtraEditMessage) {
  return bot.telegram.sendMessage(TelegramConfig.ADMIN_ID, `[ADMIN] ${text}`, extra);
}

