import { FactoryProvider } from '@nestjs/common';
import { createConnection, Connection } from 'typeorm';
import { MysqlConfig } from '../config';
import { User } from '../entity/User.entity';
import { Paragraph } from '../entity/Paragraph.entity';
import { Tag } from '../entity/Tag.entity';
import { Category } from '../entity/Category.entity';

export const MysqlService: FactoryProvider = {
  provide: Connection,
  useFactory: async () => {
    const mysql = await createConnection({
      type: 'mysql',
      host: MysqlConfig.host,
      port: MysqlConfig.port,
      username: MysqlConfig.user,
      password: MysqlConfig.password,
      database: MysqlConfig.database,
      synchronize: true,
      logging: true,
      entities: [User, Tag, Category, Paragraph],
      extra: {
        timezone: 'utc'
      }
    });
    return mysql;
  }
   
}