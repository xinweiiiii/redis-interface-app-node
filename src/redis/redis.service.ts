import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { InventoryItem } from "src/inventory/inventory.dto";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: RedisClientType
    private readonly inventoryKey = 'inventory';

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

    // Invesitory Specific Redis Helpers
    async saveInventoryItem(item: InventoryItem): Promise<void> {
        await this.client.hSet(this.inventoryKey, item.id, JSON.stringify(item));
    }

    async getInventoryItem(id: string): Promise<InventoryItem | null> {
        const item = await this.client.hGet(this.inventoryKey, id);
        return item ? JSON.parse(item) : null;
    }

    async getAllInventoryItems(): Promise<InventoryItem[]> {
        const items = await this.client.hGetAll(this.inventoryKey);
        return Object.values(items).map(item => JSON.parse(item));
    }

    async deleteInventoryItem(id: string): Promise<void> {
        await this.client.hDel(this.inventoryKey, id);
    }
}