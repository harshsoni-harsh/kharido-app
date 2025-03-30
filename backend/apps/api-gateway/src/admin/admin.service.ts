import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AdminService {
  constructor(@Inject('ADMIN_CLIENT') private client: ClientProxy) {}

    ///order management
  async getOrders() {}
  async getOrder() {}
  async updateOrder() {}
  async getPayment() {}

  //analytics
  async getRevenueByInterval() {
    //total revenue or revenue within custom period
  }
  async getOrdersPerDay() {
    //return {number of orders per day ,  day} array
  }
  async getRecentOrders(count: number) {
    // returns the count number of latest orders
  }
  async getTotalProductsSold( startDate:Date, endDate:Date){
    //get total quantity of products  sold 
  }

  //product management
  async createProduct() {}
  async updateProduct() {}
  //need to discusss
  async deleteProduct() {}

  //category management
  async createCategory() {}
  async deleteCategory() {}
  async updateCategory() {}
  //user management
  async getUsers() {}
  async getUser() {}
}
