import { Injectable, Inject } from '@nestjs/common';
import { FileConfig, File } from './file.interface';
import * as COS from 'cos-nodejs-sdk-v5';
import { SecretConfig } from '../secret/secretConfig';
import { promisify } from 'util';

@Injectable()
export class COSService {
  cos: COS;
  constructor(@Inject('COS_CONFIG') private readonly config: FileConfig) {
    this.cos = new COS(SecretConfig.tencentCOS);
  }

  async saveFile(file: File) {
    return new Promise((resolve, reject) => {
      promisify(this.cos.sliceUploadFile.bind(this.cos))({
        Bucket: this.config.COSConfig.bucket,
        Region: this.config.COSConfig.regionCode,
        Key: file.tmpFilename,
        FilePath: file.tmpFilePath,
      })
  }
}