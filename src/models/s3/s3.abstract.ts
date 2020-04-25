import { S3 } from 'aws-sdk';

const s3 = new S3();
const bucket = process.env.S3_BUCKET_CONFIG;

export abstract class S3Abstract<T> {
  data: T;
  readonly region: string;

  constructor(region: string, data?: T) {
    this.region = region;
    this.data = data;
  }

  get key(): string {
    return `${this.region}-${this.constructor.name.toLowerCase()}`;
  }

  async put(): Promise<void> {
    await s3.putObject({
      Bucket: bucket,
      Key: this.key,
      Body: JSON.stringify(this.data),
      ContentType: 'application/json',
      ContentEncoding: 'gzip',
    }).promise();
  }

  async get(): Promise<T> {
    const item = await s3.getObject({
      Bucket: bucket,
      Key: this.key,
    }).promise();

    this.data = JSON.parse(item.Body.toString('utf8'));

    return this.data;
  }
}
