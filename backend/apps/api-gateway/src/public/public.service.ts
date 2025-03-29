import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PublicService {

    constructor(
        @Inject('PUBLIC_CLIENT') private client: ClientProxy,
      ) {}
    
      async getProduct(productId: string) {
        return firstValueFrom(
          this.client.send('public_getProduct', { productId })
        );
      }
    
      async getCategories() {
        return firstValueFrom(
          this.client.send('public_getCategories', {})
        );
      }
    
      async getCategoryProducts(categoryId: string) {
        return firstValueFrom(
          this.client.send('public_getCategoryProducts', { categoryId })
        );
      }
    
      async getProductsRange(startIndex: number, endIndex: number) {
        return firstValueFrom(
          this.client.send('public_getProductsRange', { startIndex, endIndex })
        );
      }
    
      async searchProducts(payload: {
        query: string;
        sortOptions?: { field: string; order: 'asc' | 'desc' };
        page?: number;
        limit?: number;
      }) {
        return firstValueFrom(
          this.client.send('public_searchProducts', payload)
        );
      }
}
