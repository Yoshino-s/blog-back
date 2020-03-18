import * as COS from 'cos-nodejs-sdk-v5';
export class FileConfig {
  readonly COSConfig: {
    readonly secretId: string;
    readonly secretKey: string;
    readonly bucket: string;
    readonly regionCode: COS.Region;
  }
  readonly UploadConfig?: {
    tmpDir?: string;
    prefix?: string;
  };
  readonly BusboyConfig?: busboy.BusboyConfig;
}

export type File = {
  field: string;
  filename: string;
  encoding: string;
  mimeType: string;
  tmpFilename: string;
  tmpFilePath: string;
  ETag: string;
}

export type UploadedFile = {
  filename: string;
  mimeType: string;
  url: string;
  key: string;
  ETag: string;
  field: string;
}