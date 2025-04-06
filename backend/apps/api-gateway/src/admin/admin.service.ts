import { CreateCategoryDTO } from '@shared/dto/create/createCategory.dto';
import { CreateProductDTO } from '@shared/dto/create/createProduct.dto';
import { UpdateCategoryDTO } from '@shared/dto/update/updateCategory.dto';
import { UpdateProductDTO } from '@shared/dto/update/updateProduct.dto';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class AdminService {
  constructor(
    @Inject('ADMIN_CLIENT') private readonly adminClient: ClientProxy,
  ) {}

  // Order methods
  async getOrdersRange(startIndex: number, endIndex: number) {
    return firstValueFrom(
      this.adminClient.send('admin-orders.getRange', { startIndex, endIndex })
    );
  }


  async getOrder(orderId: string) {
    return firstValueFrom(
      this.adminClient.send('admin-orders.getOne', orderId)
    );
  }
  async getTotalOrders(startTime: string, endTime: string) {
    return firstValueFrom(
      this.adminClient.send('admin-orders.interval', { startTime, endTime })
    );
  }

  async updateOrder(orderId: string, status: string) {
      Logger.log(status,orderId)
    return firstValueFrom(
      this.adminClient.send('admin-orders.updateStatus', { orderId, status })
    );
  }

  async getRecentOrders(count: number) {
    return firstValueFrom(
      this.adminClient.send('admin-orders.getRecent', count)
    );
  }

  async getOrdersPerDay(startTime: string, endTime: string) {
    return firstValueFrom(
      this.adminClient.send('admin-orders.getPerDay', { startTime, endTime })
    );
  }

  // Payment methods
  async getPayment(paymentId: string) {
    return firstValueFrom(
      this.adminClient.send('admin-payments.getOne', paymentId)
    );
  }

  // Analytics methods
  async getRevenueByInterval(startTime: string, endTime: string) {
    return firstValueFrom(
      this.adminClient.send('admin-analytics.revenueByInterval', { startTime, endTime })
    );
  }

  async getTotalProductsSold(startTime: string, endTime: string) {
    return firstValueFrom(
      this.adminClient.send('admin-analytics.totalProductsSold', { startTime, endTime })
    );
  }
  async getTotalUsers(){
    return firstValueFrom(
      this.adminClient.send('admin-analytics.getTotalUsers',{})
    );
  }

  // Product methods
  async createProduct(product: CreateProductDTO) {
    return firstValueFrom(
      this.adminClient.send('admin-products.create', product)
    );
  }

  async updateProduct(product: UpdateProductDTO) {
    return firstValueFrom(
      this.adminClient.send('admin-products.update', product)
    );
  }

  async deleteProduct(productId: string) {
    return firstValueFrom(
      this.adminClient.send('admin-products.delete', productId)
    );
  }

  // Category methods
  async createCategory(category: CreateCategoryDTO) {
    return firstValueFrom(
      this.adminClient.send('admin-categories.create', category)
    );
  }

  async updateCategory(category: UpdateCategoryDTO) {
    return firstValueFrom(
      this.adminClient.send('admin-categories.update', category)
    );
  }

  async deleteCategory(categoryId: string) {
    return firstValueFrom(
      this.adminClient.send('admin-categories.delete', categoryId)
    );
  }

  // User methods
  async getUsers(startIndex: number, endIndex: number) {
    return firstValueFrom(
      this.adminClient.send('admin-users.getRange', { startIndex, endIndex })
    );
  }

  async getUser(id: string) {
    return firstValueFrom(
      this.adminClient.send('admin-users.getOne', id)
    );
  }
}