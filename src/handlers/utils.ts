import axios from 'axios';

import { BbeConfig } from '../bbe/bbe.config';
import { sendAdminMessage } from '../telegram';

export const versionCheck = async () => {
  const bbeScript = await axios.get(BbeConfig.CDN_BBE_URL);

  const [, versionString] = bbeScript.data.match(/this.clientVersion=(\d+);/);
  const version = parseInt(versionString, 10);

  if (version !== BbeConfig.CURRENT_VERSION) {
    await sendAdminMessage(`Client version changed: ${version} (expected ${BbeConfig.CURRENT_VERSION})`);
  }
};
