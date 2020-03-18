import { FactoryProvider } from '@nestjs/common';
import { createConnection, Connection } from 'typeorm';
import { MysqlConfig } from '../config';
import { User } from '../entity/User.entity';
import { Content } from 'src/entity/Content.entity';
import { Paragraph } from '../entity/Paragraph.entity';

export const MysqlService: FactoryProvider = {
  provide: Connection,
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
      'entities': [User, Content, Paragraph]
    });
    return mysql;
  }
   
}