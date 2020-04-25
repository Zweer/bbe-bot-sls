import axios from 'axios';
import { createHash } from 'crypto';
import * as querystring from 'querystring';

import { BbeConfig } from './bbe.config';

import { ConfigEnvironmentResponseDto } from './dto/config/config.environment.response.dto';
import { ConfigGameResponseDto } from './dto/config/config.game.response.dto';
import { ConfigWeb } from './dto/config/config.web';
import { ResponseDto } from './dto/response.dto';
import {ConfigGameRequestDto} from "./dto/config/config.game.request.dto";

export class BbeRequest {
  private config: BbeConfig;

  private readonly userId: string;
  private readonly userSessionId: string;

  constructor(region: string, userId: string = '0', userSessionId: string = '0') {
    this.config = new BbeConfig(region);
    this.userId = userId;
    this.userSessionId = userSessionId;
  }

  private async send<U, T extends {} = {}>(action: string, params: T = {} as any): Promise<U> {
    const url = this.config.requestUrl;
    const form = {
      action,
      rct: 1,
      user_id: this.userId,
      user_session_id: this.userSessionId,
      client_version: `html5_${BbeConfig.CURRENT_VERSION}`,
      auth: BbeRequest.getAuth(action, this.userId),
      keep_active: true,
      device_type: 'web',

      ...params,
    };

    const { data } = await axios.post<ResponseDto<U>>(url, querystring.stringify(form));

    if (data.error) {
      throw new Error(data.error);
    }

    return data.data;
  }

  async retrieveConfig(): Promise<ConfigWeb> {
    const response = await axios.get(this.config.baseUrl);

    const matches = [...response.data.matchAll(/^\s*(?<name>\w+):\s"(?<value>(.*\?(?<hash>.+))|(.*))",?$/gm)];
    return Object.fromEntries(matches
      .flatMap((match) => [
        [match.groups.name, match.groups.value],
        (match.groups.hash && match.groups.name.startsWith('url')) && [match.groups.name.replace('url', 'version'), match.groups.hash],
      ])
      .filter((match) => !!match));
  }

  async initEnvironment(): Promise<ConfigEnvironmentResponseDto> {
    return this.send<ConfigEnvironmentResponseDto>('initEnvironment');
  }

  async initGame(config: ConfigWeb): Promise<ConfigGameResponseDto> {
    return this.send<ConfigGameResponseDto, ConfigGameRequestDto>('initGame', {
      no_text: true,
      locale_version: config.localeVersion,
      locale: config.default_locale,
      swf_main_hash: config.versionSwfMain,
      swf_character_hash: config.versionSwfCharacter,
      swf_ui_hash: config.versionSwfUi,
      swf_movie_cover_hash: config.versionSwfMovieCover,
    });
  }

  private static getAuth(action: string, userId: string): string {
    return createHash('md5').update(`${action}${BbeConfig.SALT}${userId}`).digest('hex');
  }
}
