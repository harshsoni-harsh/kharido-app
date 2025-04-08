import { Controller, Post, Body, Param, Query, Logger, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateCategoryDTO } from '@shared/dto/create/createCategory.dto';
import { CreateProductDTO } from '@shared/dto/create/createProduct.dto';
import { UpdateCategoryDTO } from '@shared/dto/update/updateCategory.dto';
import { UpdateProductDTO } from '@shared/dto/update/updateProduct.dto';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Order endpoints
  @Post('orders/range')
  async getOrdersRange(@Body() data: { startIndex: number; endIndex: number }) {
    Logger.log(data.endIndex, data.startIndex)
    return this.adminService.getOrdersRange(data.startIndex, data.endIndex);
  }

  @Post('orders/get')
  async getOrder(@Body() data: { orderId: string }) {
    return this.adminService.getOrder(data.orderId);
  }

  @Post('orders/update')
  async updateOrder(@Body() data: { orderId: string; status: string }) {
    return this.adminService.updateOrder(data.orderId, data.status);
  }

  @Post('orders/recent')
  async getRecentOrders(@Body() data: { count: number }) {
    return this.adminService.getRecentOrders(data.count);
  }

  @Post('orders/interval')
  async getTotalOrders(@Body() data: { startTime: string; endTime: string }) {
    return this.adminService.getTotalOrders(data.startTime,data.endTime);
  }
  @Post('orders/daily')
  async getOrdersPerDay(@Body() data: { startTime: string; endTime: string }) {
    return this.adminService.getOrdersPerDay(data.startTime, data.endTime);
  }

  // Payment endpoints
  @Post('payments/get')
  async getPayment(@Body() data: { paymentId: string }) {
    return this.adminService.getPayment(data.paymentId);
  }

  // Analytics endpoints
  @Post('analytics/revenue')
  async getRevenueByInterval(@Body() data: { startTime: string; endTime: string }) {
    return this.adminService.getRevenueByInterval(data.startTime, data.endTime);
  }

  @Get('analytics/total-users')
  async getTotalUsers() {
    return this.adminService.getTotalUsers();
  }


  @Post('analytics/products-sold')
  async getTotalProductsSold(@Body() data: { startTime: string; endTime: string }) {
    return this.adminService.getTotalProductsSold(data.startTime, data.endTime);
  }

  // Product endpoints
  @Post('products/create')
  async createProduct(@Body() product: CreateProductDTO) {
    return this.adminService.createProduct(product);
  }

  @Post('products/update')
  async updateProduct(@Body() product: UpdateProductDTO) {
    return this.adminService.updateProduct(product);
  }

  @Post('products/delete')
  async deleteProduct(@Body() data: { productId: string }) {
    return this.adminService.deleteProduct(data.productId);
  }

  // Category endpoints
  @Post('categories/create')
  async createCategory(@Body() category: CreateCategoryDTO) {
    return this.adminService.createCategory(category);
  }

  @Post('categories/update')
  async updateCategory(@Body() category: UpdateCategoryDTO) {
    return this.adminService.updateCategory(category);
  }

  @Post('categories/delete')
  async deleteCategory(@Body() data: { categoryId: string }) {
    return this.adminService.deleteCategory(data.categoryId);
  }

  // User endpoints
  @Post('users/range')
  async getUsers(@Body() data: { startIndex: number; endIndex: number }) {
    return this.adminService.getUsers(data.startIndex, data.endIndex);
  }

  @Post('users/get')
  async getUser(@Body() data: { id: string }) {
    return this.adminService.getUser(data.id);
  }
}