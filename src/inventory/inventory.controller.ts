import { Controller, Post, Get, Delete, Patch, Param, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { nanoid } from 'nanoid'
import { InventoryItem } from './inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // TODO: Implement PATCH method to update item quantity
  // TODO: Add DTO input validation

  @Post()
  addItem(@Body() body: { name: string; quantity: number }) {
    const item: InventoryItem = {
        ...body,
        id: nanoid()
    }
    this.inventoryService.addItem(item);
    return item
  }

  @Get(':id')
  getItem(@Param('id') id: string) {
    return this.inventoryService.getItem(id);
  }

  @Get()
  getAll() {
    return this.inventoryService.getAllItems();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.inventoryService.deleteItem(id);
  }

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