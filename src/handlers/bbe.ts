import { BbeRequest } from '../bbe/bbe.request';

export async function retrieveConfig() {
  const region = 'us3';
  const bbeRequest = new BbeRequest(region);

  const environment = await bbeRequest.initEnvironment();
  const config = await bbeRequest.retrieveConfig();
  const game = await bbeRequest.initGame(config);

  console.log('a');
}
