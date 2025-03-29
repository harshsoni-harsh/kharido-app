import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@libs/shared/schemas/user.schema';
import { Order, OrderSchema } from '@libs/shared/schemas/order.schema';
import { Review, ReviewSchema } from '@libs/shared/schemas/review.schema';
import {
  Payment,
  PaymentSchema,
} from '@libs/shared/schemas/payment.schema';
import {
  ShoppingList,
  ShoppingListSchema,
} from '@libs/shared/schemas/shoppingList.schema';
import {
  Product,
  ProductSchema,
} from '@libs/shared/schemas/product.schema';
import { Cart, CartSchema } from '@libs/shared/schemas/cart.schema';
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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
