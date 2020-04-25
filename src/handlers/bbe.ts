import { BbeRequest } from '../bbe/bbe.request';
import { Constants } from '../models/s3/constants';
import { ExtendedConfig } from '../models/s3/extendedConfig';

export async function retrieveConfig() {
  const region = 'us3';
  const bbeRequest = new BbeRequest(region);

  const config = await bbeRequest.retrieveConfig();
  const { constants, extendedConfig } = await bbeRequest.initGame(config);

  const s3Constants = new Constants(region, constants);
  await s3Constants.put();

  const s3ExtendedConfig = new ExtendedConfig(region, extendedConfig);
  await s3ExtendedConfig.put();
}
