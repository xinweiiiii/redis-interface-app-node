import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "./product.dto";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {} 

    @Post()
    async createProduct(@Body() body: CreateProductDto) {
        return this.productService.createProduct(body);
    }

    @Get()
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return this.productService.getProductById(id);
    } 
    
    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
        return this.productService.updateProduct(id, body);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return this.productService.deleteProduct(id);
    }
}