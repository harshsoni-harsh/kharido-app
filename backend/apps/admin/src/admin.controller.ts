

import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminService } from './admin.service';
import { CreateCategoryDTO } from '@libs/shared/dto/create/createCategory.dto';
import { CreateProductDTO } from '@libs/shared/dto/create/createProduct.dto';
import { UpdateCategoryDTO } from '@libs/shared/dto/update/updateCategory.dto';
import { UpdateProductDTO } from '@libs/shared/dto/update/updateProduct.dto';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Order-related patterns
  @MessagePattern('admin-orders.getRange')
  async getOrdersRange(@Payload() data: { startIndex: number; endIndex: number }) {
    Logger.log(data.endIndex, data.startIndex);
    return this.adminService.getOrdersRange(data.startIndex, data.endIndex);
  }

  @MessagePattern('admin-orders.getOne')
  async getOrder(@Payload() orderId: string) {
    return this.adminService.getOrder(orderId);
  }

  @MessagePattern('admin-orders.updateStatus')
  async updateOrder(@Payload() data: { orderId: string; status: string }) {
    return this.adminService.updateOrder(data.orderId, data.status);
  }

  @MessagePattern('admin-orders.getRecent')
  async getRecentOrders(@Payload() count: number) {
    return this.adminService.getRecentOrders(count);
  }

  @MessagePattern('admin-orders.getPerDay')
  async getOrdersPerDay(@Payload() data: { startTime: string; endTime: string }) {
    return this.adminService.getOrdersPerDay(data.startTime, data.endTime);
  }

  // Payment patterns
  @MessagePattern('admin-payments.getOne')
  async getPayment(@Payload() paymentId: string) {
    return this.adminService.getPayment(paymentId);
  }

  // Analytics patterns
  @MessagePattern('admin-analytics.revenueByInterval')
  async getRevenueByInterval(@Payload() data: { startTime: string; endTime: string }) {
    return this.adminService.getRevenueByInterval(data.startTime, data.endTime);
  }

  @MessagePattern('admin-analytics.totalProductsSold')
  async getTotalProductsSold(@Payload() data: { startTime: string; endTime: string }) {
    return this.adminService.getTotalProductsSold(data.startTime, data.endTime);
  }

  // Product patterns
  @MessagePattern('admin-products.create')
  async createProduct(@Payload() product: CreateProductDTO) {
    return this.adminService.createProduct(product);
  }

  @MessagePattern('admin-products.update')
  async updateProduct(@Payload() product: UpdateProductDTO) {
    return this.adminService.updateProduct(product);
  }

  @MessagePattern('admin-products.delete')
  async deleteProduct(@Payload() productId: string) {
    return this.adminService.deleteProduct(productId);
  }

  // Category patterns
  @MessagePattern('admin-categories.create')
  async createCategory(@Payload() category: CreateCategoryDTO) {
    return this.adminService.createCategory(category);
  }

  @MessagePattern('admin-categories.update')
  async updateCategory(@Payload() category: UpdateCategoryDTO) {
    return this.adminService.updateCategory(category);
  }

  @MessagePattern('admin-categories.delete')
  async deleteCategory(@Payload() categoryId: string) {
    return this.adminService.deleteCategory(categoryId);
  }

  // User patterns
  @MessagePattern('admin-users.getRange')
  async getUsers(@Payload() data: { startIndex: number; endIndex: number }) {
    return this.adminService.getUsers(data.startIndex, data.endIndex);
  }

  @MessagePattern('admin-users.getOne')
  async getUser(@Payload() id: string) {
    return this.adminService.getUser(id);
  }
}