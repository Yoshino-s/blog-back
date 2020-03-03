import { Injectable, Inject } from '@nestjs/common';
import { FileConfig, File } from './file.interface';
import { FastifyRequest } from 'fastify';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { createWriteStream } from 'fs';
import { Stream } from 'stream';

@Injectable()
export class FileService {
  constructor(@Inject('COS_CONFIG') private readonly config: FileConfig) { }
  
  async loadFile(req: FastifyRequest): Promise<File[]> {
    if (!req.isMultipart)
      return [];
    return new Promise<File[]>(async (resolve, reject) => {
      const files: Promise<File>[] = [];
      const next = (err: Error) => {
        if (err)
          reject(err);
        else
          resolve(Promise.all(files));
      }
      const handler = (field: string, file: Stream, filename: string, encoding: string, mimetype: string) => {
        const tmpFilename = this.config.UploadConfig?.prefix + randomBytes(8).toString('hex') + filename;
        const tmpFilePath = join(this.config.UploadConfig?.tmpDir, tmpFilename);
        const f = createWriteStream(tmpFilePath);
        file.pipe(f);
        files.push(new Promise(res => {
          f.on('close', () => {
            res({
              field, filename, mimetype, encoding,
              tmpFilename, tmpFilePath
            });
          });
        }));
      };
      req.multipart(handler, next, this.config.BusboyConfig);
    });
  }
}