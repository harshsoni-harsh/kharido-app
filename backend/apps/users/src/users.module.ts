import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'apps/libs/shared/schemas/user.schema';
import { Order, OrderSchema } from 'apps/libs/shared/schemas/order.schema';
import { Review, ReviewSchema } from 'apps/libs/shared/schemas/review.schema';
import { Payment, PaymentSchema } from 'apps/libs/shared/schemas/payment.schema';
import { ShoppingList, ShoppingListSchema } from 'apps/libs/shared/schemas/shoppingList.schema';
import {  Product, ProductSchema } from 'apps/libs/shared/schemas/product.schema';
import {  CartSchema } from 'apps/libs/shared/schemas/cart.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://getmyidin11:Je9fLPCKct2gHPqY@kharido.2ruw6.mongodb.net/kharido',{
      onConnectionCreate(){
        console.log("connecting");
      },
      
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/kharido',{
    //   onConnectionCreate(){
    //     console.log("connecting");
    //   },
      
    // }),

    
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {name: Order.name, schema:OrderSchema},
      {name:Review.name, schema:ReviewSchema},
      {name:Payment.name, schema: PaymentSchema},
      {name:ShoppingList.name, schema:ShoppingListSchema},
      {name:Product.name, schema:ProductSchema},
      // {name:'Cart', schema:CartSchema}

    ]),
   
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
