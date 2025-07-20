import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryModule } from './inventory/inventory.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // load from .env
    InventoryModule,
    RedisModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}