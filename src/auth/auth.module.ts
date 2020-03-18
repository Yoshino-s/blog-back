import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { SecretConfig } from '../secret/secretConfig';
import { JwtStrategy } from './jwt.strategy';
import { DbModule } from '../db/db.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
      },
      publicKey: SecretConfig.rsa.public,
      privateKey: SecretConfig.rsa.private,
      verifyOptions: {
        algorithms: ['RS256'],
      }
    })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
  
}