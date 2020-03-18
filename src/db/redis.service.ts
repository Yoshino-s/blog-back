import { FactoryProvider } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';
import { RedisConfig } from '../config';

export const RedisService: FactoryProvider = {
  provide: RedisClient,
  useFactory: async () => {
    const redis = createClient({
      host: RedisConfig.host,
      port: RedisConfig.port,
      password: RedisConfig.password
    });
    return redis;
  }
   
}