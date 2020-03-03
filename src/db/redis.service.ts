import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisConfig } from '../config';

export const RedisService: FactoryProvider = {
  provide: 'REDIS',
  useFactory: async () => {
    const redis = createClient({
      host: RedisConfig.host,
      port: RedisConfig.port,
      password: RedisConfig.password
    });
    return redis;
  }
   
}