import { Module } from '@nestjs/common';
import { UtilsController } from './utils/utils.controller';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { MailerModule } from '@nest-modules/mailer';
import { SecretConfig } from './secret/secretConfig';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    UserModule, DbModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.126.com',
        secure: true,
        auth: {
          user: SecretConfig.mail.user,
          pass: SecretConfig.mail.password
        }
      },
      defaults: {
        from: {
          name: 'Yoshino-s Server Verify Service',
          address: SecretConfig.mail.user
        }
      }
    }),
    FileModule.register({
      COSConfig: {
        secretId: SecretConfig.tencentCOS.SecretId,
        secretKey: SecretConfig.tencentCOS.SecretKey,
        bucket: 'test-1300262299',
        regionCode: 'ap-shanghai'
      }
    })
  ],
  controllers: [UtilsController],
  providers: [],
})
export class AppModule {}
