import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { handleResponse } from '../utils';

@Injectable()
export class PublicService {

    constructor(
        @Inject('PUBLIC_CLIENT') private client: ClientProxy,
      ) {}
    
      async getProduct(productId: string) {
        const res = await firstValueFrom(
          this.client.send('public_getProduct',  productId )
        ) as RPCResponse;
        return handleResponse(res);
      }
    
      async getCategories() {
        return firstValueFrom(
          this.client.send('public_getCategories', {})
        );
      }
    
      async getCategoryProducts(categoryId: string) {
        return firstValueFrom(
          this.client.send('public_getCategoryProducts', categoryId )
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
