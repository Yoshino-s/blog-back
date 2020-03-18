import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from '../entity/User.entity';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './payload.interface';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { GlobalConfig } from '../config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly connection: Connection,
    private readonly redisClient: RedisClient
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
  async getUser(id: number): Promise<User> {
    return this.connection.getRepository(User).findOne(id);
  }

  async getJwt(user: User) {
    const k = randomBytes(16).toString('hex');
    await promisify(this.redisClient.setex.bind(this.redisClient))(`key-${user.id}`, GlobalConfig.jwtExpireTime, k);
    const payload: Payload = {
      name: user.name,
      sub: user.id,
      exp: Date.now() + GlobalConfig.jwtExpireTime * 1000,
      s: k
    };
    return this.jwtService.sign(payload);
  }
}