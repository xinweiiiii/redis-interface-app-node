import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { User } from "src/user/user.dto";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

    private client: RedisClientType
    private readonly inventoryKey = 'user';

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

    async saveUser(user: User): Promise<void> {
        await this.client.hSet(this.inventoryKey, user.id, JSON.stringify(user));
        // Adding a secondary index for username
        await this.client.set(`username:${user.username}`, user.id);
    }

    async userExists(username: string): Promise<boolean> {
        const exists = await this.client.exists(`username:${username}`);
        return exists === 1;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const userId = await this.client.get(`username:${username}`);
        if (!userId) {
            return null;
        }
        const user = await this.client.hGet(this.inventoryKey, userId);
        return user ? JSON.parse(user) : null;
    }

}