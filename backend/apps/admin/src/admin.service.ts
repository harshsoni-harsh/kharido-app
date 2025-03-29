import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Cart } from '@libs/shared/schemas/cart.schema';
import { Order } from '@libs/shared/schemas/order.schema';
import { Product } from '@libs/shared/schemas/product.schema';
import { Review } from '@libs/shared/schemas/review.schema';
import { ShoppingList } from '@libs/shared/schemas/shoppingList.schema';
import { User } from '@libs/shared/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
    constructor(
      @InjectModel('User') private readonly userModel: Model<User>,
      @InjectModel('Order') private readonly orderModel: Model<Order>,
      @InjectModel('Product') private readonly productModel: Model<Product>,
      @InjectModel('ShoppingList') private readonly shoppingListModel: Model<ShoppingList>,
      @InjectModel('Cart') private readonly cartModel: Model<Cart>,
      @InjectModel('Review') private readonly reviewModel: Model<Review>
    ) { }
    
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
