import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SecretConfig } from '../secret/secretConfig';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      signOptions: {
        algorithm: 'RS256',
      },
      secretOrKey: SecretConfig.rsa.public,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}