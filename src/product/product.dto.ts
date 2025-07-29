export class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    unit: string;
    taxRate?: number;
    categoryId?: string;
    images?: string[];
    variants?: { name: string; sku: string; stock: number; price: number }[];
}

export class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    unit?: string;
    taxRate?: number;
    categoryId?: string;
    images?: string[];
}
