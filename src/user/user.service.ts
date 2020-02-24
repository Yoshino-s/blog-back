import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from '../entity/User.entity';
import { createHmac } from 'crypto';
import { GlobalConfig } from '../config';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @Inject('DB') private readonly connection: Connection,
    private readonly mailService: MailerService
  ) { }
  
  async register(name: string, password: string, email: string): Promise<User|null> {
    const r = await this.connection.getRepository(User).findOne({
      name
    });
    if (r)
      return null;
    const verifyCode = createHmac('sha256', GlobalConfig.key)
      .update(GlobalConfig.salt + name + password)
      .digest('hex');
    const user = await this.connection.getRepository(User)
      .create({
        name: name,
        password: password,
        email: email,
        verifyCode
      }).save();
    console.log(this.mailService);
    this.mailService
      .sendMail({
        to: email,
        subject: 'Verify your account',
        text: verifyCode,
        html: verifyCode
      });
    return user;
  }

  async verify(verifyCode: string): Promise<boolean> {
    const r = await this.connection.getRepository(User).findOne({
      verifyCode
    });
    if (!r)
      return false;
    r.verified = true;
    await r.save();
    return true;
  }
}
