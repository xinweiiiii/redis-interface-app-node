import { Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.otp.service";

@Injectable()
export class OtpService {
    private readonly OTP_EXPIRATION_SECONDS = 300; // 5 minutes

    constructor(private readonly redisService: RedisService) {}

    async generateOtp(key: string): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        await this.redisService.setOtp(key, otp, this.OTP_EXPIRATION_SECONDS);
        return otp;
    }

    async verifyOtp(identifier: string, code: string): Promise<boolean> {
        const storedOtp = await this.redisService.getOtp(identifier);
        if (!storedOtp) {
            return false;
        }

        if (storedOtp === code) {
            // OTP is one-time use — delete it after successful validation
            await this.redisService.deleteOtp(identifier);
            return true;
        }

        return false;
    } 
}