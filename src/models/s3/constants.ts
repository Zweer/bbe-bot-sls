import { S3Abstract } from './s3.abstract';
import { ConfigGameResponseDto } from '../../bbe/dto/config/config.game.response.dto';

export class Constants extends S3Abstract<ConfigGameResponseDto['constants']> {}
