import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { FileModule } from '../file/file.module';
import { SecretConfig } from '../secret/secretConfig.template';

@Module({
  imports: [AuthModule, FileModule.register({
    COSConfig: {
      secretId: SecretConfig.tencentCOS.SecretId,
      secretKey: SecretConfig.tencentCOS.SecretKey,
      bucket: 'test-1300262299',
      regionCode: 'ap-shanghai'
    }
  })],
  controllers: [ContentController],
  providers: [ContentService]
})
export class ContentModule {}
