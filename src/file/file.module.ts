import { Module, DynamicModule } from '@nestjs/common';
import { FileService } from './file.service';
import { FileConfig } from './file.interface';
import { merge } from 'lodash';
import { COSService } from './cos.service';

@Module({})
export class FileModule {
  static register(config: FileConfig): DynamicModule {
    return {
      module: FileModule,
      providers: [{
        provide: 'COS_CONFIG',
        useFactory: () => {
          const defaultConfig: Partial<FileConfig> = {
            UploadConfig: {
              prefix: '',
              tmpDir: '/tmp/'
            }
          }
          return merge(defaultConfig, config);
        }
      }, FileService, COSService],
      exports: [FileService, COSService]
    }
  }
}