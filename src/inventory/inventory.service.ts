import { RedisService } from '../redis/redis.service';
import { InventoryItem } from "../inventory/inventory.dto";
import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {
    constructor(private readonly redisService: RedisService) {}

    async addItem(item: InventoryItem): Promise<void> {
        await this.redisService.saveInventoryItem(item);
    }

    async getItem(id: string): Promise<InventoryItem | null> {
        return await this.redisService.getInventoryItem(id);
    }

    async getAllItems(): Promise<InventoryItem[]> {
        return await this.redisService.getAllInventoryItems();
    }

    async deleteItem(id: string): Promise<void> {
        await this.redisService.deleteInventoryItem(id);
    }

    async incrementItemQuantity(id: string, amount: number): Promise<void> {
        await this.redisService.incrementItemQuantity(id, amount);
    }
}