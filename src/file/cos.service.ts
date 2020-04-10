import { Injectable, Inject } from '@nestjs/common';
import { FileConfig, File, UploadedFile } from './file.interface';
import * as COS from 'cos-nodejs-sdk-v5';
import { SecretConfig } from '../secret/secretConfig';

@Injectable()
export class COSService {
  cos: COS;
  constructor(@Inject('COS_CONFIG') private readonly config: FileConfig) {
    this.cos = new COS(SecretConfig.tencentCOS);
  }

  async saveFile(file: File) {
    return new Promise<UploadedFile>((resolve, reject) => {
      this.cos.sliceUploadFile({
        Bucket: this.config.COSConfig.bucket,
        Region: this.config.COSConfig.regionCode,
        Key: file.tmpFilename,
        FilePath: file.tmpFilePath
      }, (err, dat) => {
        if (err)
          reject(err);
        else
          resolve({
            filename: file.filename,
            mimeType: file.mimeType,
            url: 'https://'+dat.Location,
            ETag: file.ETag,
            key: file.tmpFilename,
            field: file.field
          });
      });
    });
  }

  async saveFiles(files: File[]) {
    if (files.length === 0)
      return [];
    console.log(this.config);
    return new Promise<UploadedFile[]>((resolve, reject) => {
      this.cos.uploadFiles({
        files: files.map(file => ({
          Bucket: this.config.COSConfig.bucket,
          Region: this.config.COSConfig.regionCode,
          Key: file.tmpFilename,
          FilePath: file.tmpFilePath
        })),
        SliceSize: 3 * 1024 * 1024
      }, (err, data) => {
        if (err)
          reject(err);
        else {
          const res: UploadedFile[] = files.map(file => ({
            filename: file.filename,
            mimeType: file.mimeType,
            key: file.tmpFilename,
            ETag: file.ETag,
            url: '',
            field: file.field,
          }));
          data.files.forEach(f => {
            if (f.err)
              reject(f.err);
            else {
              const t = res.find(fi => fi.key === f.options.Key);
              t.url = 'https://'+f.data.Location;
            }
          });
          resolve(res);
        }
      })
    });
  }
}