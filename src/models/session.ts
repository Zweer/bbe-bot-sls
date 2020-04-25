import {
  attribute,
  hashKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';

import { AbstractModel } from './abstract';

@table(process.env.DYNAMODB_TABLE_SESSIONS)
export class Session extends AbstractModel {
  @hashKey()
  id: string;

  @attribute()
  email: string;

  @attribute()
  password: string;

  @attribute()
  data: object;

  @attribute()
  lastRefresh: Date;
}
