import { FactoryProvider } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { MysqlConfig } from '../config';

export const DBService: FactoryProvider = {
  provide: 'DB',
  useFactory: async () => {
    const db = await createConnection({
      'type': 'mysql',
      'host': MysqlConfig.host,
      'port': MysqlConfig.port,
      'username': MysqlConfig.user,
      'password': MysqlConfig.password,
      'database': MysqlConfig.database,
      'synchronize': true,
      'logging': true,
      'entities': [
        __dirname + '/../entity/**/*.entity{.js,.ts}'
      ]
    });
    return db;
  }
   
}