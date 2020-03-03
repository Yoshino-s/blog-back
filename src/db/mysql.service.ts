import { FactoryProvider } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { MysqlConfig } from '../config';
import { User } from '../entity/User.entity';
import { Content } from 'src/entity/Content.entity';

export const MysqlService: FactoryProvider = {
  provide: 'MYSQL',
  useFactory: async () => {
    const mysql = await createConnection({
      'type': 'mysql',
      'host': MysqlConfig.host,
      'port': MysqlConfig.port,
      'username': MysqlConfig.user,
      'password': MysqlConfig.password,
      'database': MysqlConfig.database,
      'synchronize': true,
      'logging': true,
      'entities': [User, Content]
    });
    return mysql;
  }
   
}