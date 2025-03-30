import { Body, Controller, Get, Post } from '@nestjs/common';
import { PublicService } from './public.service';


@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Post('get-product')
  async getProduct(@Body() body: { productId: string }) {
    return this.publicService.getProduct(body.productId);
  }

  @Post('get-categories')
  async getCategories() {
    return this.publicService.getCategories();
  }

  @Post('get-category-products')
  async getCategoryProducts(@Body() body: { categoryId: string }) {
    return this.publicService.getCategoryProducts(body.categoryId);
  }

  @Post('get-products-range')
  async getProductsRange(@Body() body: { startIndex: number; endIndex: number }) {
    return this.publicService.getProductsRange(body.startIndex, body.endIndex);
  }

  @Post('search-products')
  async searchProducts(@Body() body: {
    query: string;
    sortOptions?: { field: string; order: 'asc' | 'desc' };
    page?: number;
    limit?: number;
  }) {
    return this.publicService.searchProducts(body);
  }
}
