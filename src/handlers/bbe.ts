import { BbeRequest } from '../bbe/bbe.request';

import { Constants } from '../models/s3/constants';
import { ExtendedConfig } from '../models/s3/extendedConfig';

import { Session } from '../models/session';

const session = Object.assign(new Session(), {
  region: 'us3',
  email: 'n.olivieriachille@gmail.com',
  password: 'ingmar516',
});

export async function retrieveConfig() {
  const bbeRequest = new BbeRequest(session.region);

  const config = await bbeRequest.retrieveConfig();
  const { constants, extendedConfig } = await bbeRequest.initGame(config);

  const s3Constants = new Constants(session.region, constants);
  await s3Constants.put();

  const s3ExtendedConfig = new ExtendedConfig(session.region, extendedConfig);
  await s3ExtendedConfig.put();
}

export async function refreshLogin() {
  const bbeRequest = new BbeRequest(session.region);

  const login = await bbeRequest.loginUser(session.email, session.password);

  console.log('a');
}
