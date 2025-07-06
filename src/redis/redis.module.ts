import { Module } from '@nestjs/common';
import { RedisService } from './redis.inventory.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}