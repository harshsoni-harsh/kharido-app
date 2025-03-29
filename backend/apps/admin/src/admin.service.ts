import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Cart } from 'apps/libs/shared/schemas/cart.schema';
import { Order } from 'apps/libs/shared/schemas/order.schema';
import { Product } from 'apps/libs/shared/schemas/product.schema';
import { Review } from 'apps/libs/shared/schemas/review.schema';
import { ShoppingList } from 'apps/libs/shared/schemas/shoppingList.schema';
import { User } from 'apps/libs/shared/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
    constructor(
      @InjectModel('User') private readonly userModel: Model<User>,
      @InjectModel('Order') private readonly orderModel: Model<Order>,
      @InjectModel('Product') private readonly ProductModel: Model<Product>,
      @InjectModel('ShoppingList')
      private readonly shoppingListModel: Model<ShoppingList>,
      @InjectModel('Cart') private readonly cartModel: Model<Cart>,
      @InjectModel('Review') private readonly reviewModel: Model<Review>
    ) { }
    
    getHello(): string {
      return 'Hello World!';
    }



  
}
