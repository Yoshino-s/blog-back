import { MailerService } from '@nest-modules/mailer';
import { SecretConfig } from './src/secret/secretConfig';


const m = new MailerService({
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
});

console.log(m.sendMail({
  to: '10195101488@stu.ecnu.edu.cn',
  subject: 'Verify your account',
  text: 'verifyCode',
  html: 'verifyCode'
}))