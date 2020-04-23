// eslint-disable-next-line no-unused-vars
import { APIGatewayProxyHandler } from 'aws-lambda';

import { bot } from '../telegram';

export const setWebhook: APIGatewayProxyHandler = async (event) => {
  const domain = event.requestContext.domainName;
  const path = event.requestContext.path
    .replace('setWebhook', 'webhook');
  const url = `https://${domain}${path}`;

  const success = await bot.telegram.setWebhook(url);

  return {
    statusCode: 200,
    body: JSON.stringify({ success }),
  };
};
