import { Controller, Post, Get, Delete, Patch, Param, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  addItem(@Body() body: { id: string; name: string; quantity: number }) {
    return this.inventoryService.addItem(body);
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
}