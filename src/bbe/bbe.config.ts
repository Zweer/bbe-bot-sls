type path = 'request';
type paths = { [key in path]: string };

type cdnPath = 'bbe';
type cdnPaths = { [key in cdnPath]: string };

export class BbeConfig {
  static BASE_URL: string = 'https://{SERVER}.bigbangempire.com/';
  static PATHS: paths = {
    request: 'request.php',
  };

  static CDN_BASE_URL: string = 'https://bbe-static.akamaized.net';
  static CDN_PATHS: cdnPaths = {
    bbe: '/assets/html5/BBE.min.js',
  };

  static CURRENT_VERSION = 97;
  static SALT = 'bpHgj5214';

  private readonly region: string;

  constructor(region: string = 'us1') {
    this.region = region;
  }

  private static GET_CDN_URL(path: cdnPath): string {
    return `${BbeConfig.CDN_BASE_URL}${BbeConfig.CDN_PATHS[path]}`;
  }

  static get CDN_BBE_URL(): string {
    return this.GET_CDN_URL('bbe');
  }

  private get baseUrl(): string {
    return BbeConfig.BASE_URL.replace('{SERVER}', this.region);
  }

  get requestUrl(): string {
    return `${this.baseUrl}${BbeConfig.PATHS.request}`;
  }
}
