import { Controller, Post, Get, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { nanoid } from 'nanoid'
import { InventoryItem } from './inventory.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // TODO: Implement PATCH method to update item quantity
  // TODO: Add DTO input validation

  @UseGuards(JwtAuthGuard)
  @Post()
  // Add a new item to the inventory
  // Example request body: { "name": "item1", "quantity": 10
  addItem(@Body() body: { name: string; quantity: number }) {
    const item: InventoryItem = {
        ...body,
        id: nanoid()
    }
    this.inventoryService.addItem(item);
    return item
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getItem(@Param('id') id: string) {
    return this.inventoryService.getItem(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.inventoryService.getAllItems();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.inventoryService.deleteItem(id);
  }

  @UseGuards(JwtAuthGuard)
	@Patch(':id/quantity')
	async incrementQuantity(
			@Param('id') id: string,
			@Body() body: { quantity: number }
	) {
			const { quantity } = body;
			this.inventoryService.incrementItemQuantity(id, quantity);
			return {
				id,
				quantity
			};
	}
}