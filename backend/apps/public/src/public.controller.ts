import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PassThrough } from 'stream';

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @MessagePattern('public_getProduct')
  async getProduct(@Payload() productId: string) {
    return await this.publicService.getProduct(productId);
  }

  @MessagePattern('public_getCategories')
  async getCategories() {
    return await this.publicService.getCategories();
  }

  @MessagePattern('public_getCategoryProducts')
  async getCategoryProducts(@Payload() categoryId: string) {
    return await this.publicService.getCategoryProducts(categoryId);
  }

  @MessagePattern('public_getProductsRange')
  async getProductsRange(@Payload() payload: { startIndex: number, endIndex: number }) {
    return await this.publicService.getProductsRange(payload.startIndex, payload.endIndex);
  }

  @MessagePattern('public_searchProducts')
  async searchProducts(
    @Payload() payload: { 
      query: string, 
      sortOptions?: { field: string, order: 'asc' | 'desc' },
      limit?: number,
      page?: number
    }
  ) {
    return await this.publicService.searchProducts(
      payload.query,
      payload.sortOptions,
      payload.limit,
      payload.page
    );
  }

  @MessagePattern('public_searchByUserInput')
  async searchByUserInput(@Payload() payload: { query: string, limit?: number }) {
    return await this.publicService.searchByUserInput(payload.query, payload.limit);
  }
  
}
