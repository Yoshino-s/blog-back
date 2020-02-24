import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from '../entity/User.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('DB') private readonly connection: Connection,
  ) { }
  async validateUser(name: string, password: string): Promise<User | null> {
    const r = await this.connection.getRepository(User).findOne({
      name,
      password
    });
    if (!r)
      return null;
    return r;
  }

  async login(user: User) {
    const payload = {
      username: user.name,
      sub: user.id
    };
    return {
      jwt: this.jwtService.sign(payload)
    }
  }
}