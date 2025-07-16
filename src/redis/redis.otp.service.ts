import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { SESSION } from "src/session/session.dto";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    // TODO: Add method to generate metrics on redis response time

    private client: RedisClientType
    private readonly otpKey = 'otp';

    async onModuleInit() {
        this.client = createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379', 10),
            },
            password: process.env.REDIS_PASSWORD || undefined,
            });       
        this.client.on('error', (err) => console.error('Redis Client Error', err));
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async setOtp(key: string, otp: string, ttlSeconds: number): Promise<void> {
        await this.client.set(`${this.otpKey}:${key}`, otp, { EX: ttlSeconds, NX: true });
    }

    async getOtp(key: string): Promise<string | null> {
        return await this.client.get(`${this.otpKey}:${key}`);
    }

    async deleteOtp(key: string): Promise<void> {
        await this.client.del(`${this.otpKey}:${key}`);
    }
}