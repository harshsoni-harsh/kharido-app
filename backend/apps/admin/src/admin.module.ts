import { Logger, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist';
import { Product, ProductSchema } from '@libs/shared/schemas/product.schema';
import { Review, ReviewSchema } from '@libs/shared/schemas/review.schema';
import { User, UserSchema } from '@libs/shared/schemas/user.schema';
import { Category, CategorySchema } from '@libs/shared/schemas/category.schema';
import { Payment, PaymentSchema } from '@libs/shared/schemas/payment.schema';
import { ShoppingList, ShoppingListSchema } from '@libs/shared/schemas/shoppingList.schema';
import { Cart, CartSchema } from '@libs/shared/schemas/cart.schema';
import { Order, OrderSchema } from '@libs/shared/schemas/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
              isGlobal: true,
              envFilePath: '.env',
            }),
            MongooseModule.forRoot(process.env.DB_STRING!, {
              onConnectionCreate() {
                Logger.log('Mongodb connected successfully');
              },
            }),
            MongooseModule.forFeature([
         
              { name: Review.name, schema: ReviewSchema },
              { name: Product.name, schema: ProductSchema },
              {name:User.name, schema:UserSchema},
              {name:Category.name,schema:CategorySchema},
              {name:Payment.name,schema:PaymentSchema},
              {name:ShoppingList.name,schema:ShoppingListSchema},
              {name:Cart.name,schema:CartSchema},
              {name:Order.name,schema:OrderSchema},

            
            ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
