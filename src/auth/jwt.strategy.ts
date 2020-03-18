import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SecretConfig } from '../secret/secretConfig';
import { Payload } from './payload.interface';
import { promisify } from 'util';
import { RedisClient } from 'redis';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      signOptions: {
        algorithm: 'RS256',
      },
      secretOrKey: SecretConfig.rsa.public,
    });
  }

  async validate(payload: Payload) {
    const k = await promisify(this.redisClient.get.bind(this.redisClient))(`key-${payload.sub}`);
    if (!k || k !== payload.s)
      return null;
    return this.authService.getUser(payload.sub);
  }
}