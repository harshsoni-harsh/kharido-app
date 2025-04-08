import { Logger, Module } from '@nestjs/common';
import { UserController} from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@shared/schemas/user.schema';
import { Order, OrderSchema } from '@shared/schemas/order.schema';
import { Review, ReviewSchema } from '@shared/schemas/review.schema';
import {
  Payment,
  PaymentSchema,
} from '@shared/schemas/payment.schema';
import {
  ShoppingList,
  ShoppingListSchema,
} from '@shared/schemas/shoppingList.schema';
import {
  Product,
  ProductSchema,
} from '@shared/schemas/product.schema';
import { Cart, CartSchema } from '@shared/schemas/cart.schema';
import { ConfigModule } from '@nestjs/config';

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
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: ShoppingList.name, schema: ShoppingListSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
