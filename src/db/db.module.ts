import { Module, Global } from '@nestjs/common';
import { MysqlService } from './mysql.service';

@Global()
@Module({
  providers: [MysqlService],
  exports: [MysqlService]
})
export class DbModule {}
