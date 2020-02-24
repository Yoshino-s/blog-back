import { Module } from '@nestjs/common';
import { UtilsController } from './utils/utils.controller';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { MailerModule } from '@nest-modules/mailer';
import { SecretConfig } from './secret/secretConfig';

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
    })
  ],
  controllers: [UtilsController],
  providers: [],
})
export class AppModule {}
