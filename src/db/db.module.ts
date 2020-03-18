import { Module, Global } from '@nestjs/common';
import { MysqlService } from './mysql.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [MysqlService, RedisService],
  exports: [MysqlService, RedisService]
})
export class DbModule {}
