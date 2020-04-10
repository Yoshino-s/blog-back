import { createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Stream } from 'stream';
import { randomBytes, createHash } from 'crypto';
import { join } from 'path';
import { createWriteStream, createReadStream } from 'fs';
import * as FileType from 'file-type';
import { Logger } from './logger';
import { File } from '../file/file.interface';

async function md5sum(path: string) {
  return new Promise<string>(resolve => {
    const stream = createReadStream(path);
    const hash = createHash('md5');
    stream.on('data', d => hash.update(d));
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    })
  });
}

export type CusFormData = Record<string, string | File>;

export const Form = createParamDecorator(async (data: string, req: FastifyRequest): Promise<CusFormData> => {
  if (!req.isMultipart())
    return {};
  return new Promise<CusFormData>(async (resolve, reject) => {
    const formData: Record<string, File|string> = {};
    const filesPromise: Promise<File>[] = [];
    const next = async (err: Error) => {
      if (err)
        reject(err);
      else {
        (await Promise.all(filesPromise)).forEach(file => {
          formData[file.field] = file;
        });
        resolve(formData);
      }
    }
    const handler = (field: string, file: Stream, filename: string, encoding: string, mimeType: string) => {
      const tmpFilename = randomBytes(8).toString('hex') + filename;
      const tmpFilePath = join('/tmp/', tmpFilename);
      const f = createWriteStream(tmpFilePath);
      file.pipe(f);
      filesPromise.push(new Promise(async res => {
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
            ETag: await md5sum(tmpFilePath)
          });
        });
      }));
    };
    const mp = req.multipart(handler, next);
    mp.on('field', (key: string, value: string) => {
      formData[key] = value;
    });
  });
})