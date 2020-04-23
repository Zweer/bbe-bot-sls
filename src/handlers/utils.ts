import axios from 'axios';

import { BbeConfig } from '../bbe/bbe.config';
import { sendAdminMessage } from '../telegram';

export async function versionCheck() {
  const bbeScript = await axios.get(BbeConfig.CDN_BBE_URL);

  const [, versionString] = bbeScript.data.match(/this.clientVersion=(\d+);/);
  const version = parseInt(versionString, 10);

  if (version !== BbeConfig.CURRENT_VERSION) {
    await sendAdminMessage(`Client version changed: ${version} (expected ${BbeConfig.CURRENT_VERSION})`);
  }

  const [, salt] = bbeScript.data.match(/md5Hash\(a\+"(.+)"\+b\)/);

  if (salt !== BbeConfig.SALT) {
    await sendAdminMessage(`Salt changed: ${salt} (expected ${BbeConfig.SALT})`);
  }
}
