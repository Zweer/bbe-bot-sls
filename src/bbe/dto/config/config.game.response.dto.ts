import { ConfigEnvironmentResponseDto } from './config.environment.response.dto';
import { ResponseDataDto } from '../response.data.dto';
import { locales } from '../types';

export interface ConfigGameResponseDto extends ResponseDataDto {
  constants: {};
  extendedConfig: ConfigEnvironmentResponseDto;
  leaderboard_server_selection_data: { [locale in locales]: { server_ids: string[] } };
}
