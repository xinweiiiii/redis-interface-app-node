import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MailService } from '../otp/mail.service';
import { OtpService } from '../otp/otp.service';
import { UserController } from './user.controller';
import { RedisModule } from '../redis/redis.module';


@Module({
  imports: [RedisModule],
  controllers: [UserController],
  providers: [UserService, MailService, OtpService],
})
export class UserModule {}