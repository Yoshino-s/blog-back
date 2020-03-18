import { Injectable, Inject } from '@nestjs/common';
import { FileConfig, File } from './file.interface';
import { FastifyRequest } from 'fastify';
import { join } from 'path';
import { randomBytes, createHash } from 'crypto';
import { createWriteStream, createReadStream } from 'fs';
import { Stream } from 'stream';
import * as FileType from 'file-type';
import { Logger } from '../utils/logger';

@Injectable()
export class FileService {
  constructor(@Inject('COS_CONFIG') private readonly config: FileConfig) { }
  
  async loadFile(req: FastifyRequest): Promise<File[]> {
    if (!req.isMultipart())
      return [];
    return new Promise<File[]>(async (resolve, reject) => {
      const files: Promise<File>[] = [];
      const next = (err: Error) => {
        if (err)
          reject(err);
        else 
          resolve(Promise.all(files));
      }
      const handler = (field: string, file: Stream, filename: string, encoding: string, mimeType: string) => {
        const tmpFilename = this.config.UploadConfig?.prefix + randomBytes(8).toString('hex') + filename;
        const tmpFilePath = join(this.config.UploadConfig?.tmpDir, tmpFilename);
        const f = createWriteStream(tmpFilePath);
        file.pipe(f);
        files.push(new Promise(async res => {
          f.on('close', async () => {
            const mime = await FileType.fromFile(tmpFilePath);
            if (!mime) {
              Logger.warn(`Cannot identity the file type. Filename: ${filename}`)
            }
            else if (mimeType !== mime?.mime) {
              Logger.warn(`Detect wrong mimetype: Real: ${mime.mime}, Fake: ${mimeType}. Filename: ${filename}`);
            }
            res({
              field, filename, mimeType: mime?.mime ?? mimeType, encoding,
              tmpFilename, tmpFilePath,
              ETag: await this.md5sum(tmpFilePath)
            });
          });
        }));
      };
      req.multipart(handler, next, this.config.BusboyConfig);
    });
  }

  async md5sum(path: string) {
    return new Promise<string>(resolve => {
      const stream = createReadStream(path);
      const hash = createHash('md5');
      stream.on('data', d => hash.update(d));
      stream.on('end', () => {
        resolve(hash.digest('hex'));
      })
    });
  }
}