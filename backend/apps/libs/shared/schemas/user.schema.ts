import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ShoppingList } from './shoppingList.schema';
import { Cart } from './cart.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class Address {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  street: string;

  @Prop()
  landmark?: string;

  @Prop({ required: true })
  pin: number;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  phone: string;
}

@Schema({ collection: 'User' })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  gender: string;

  @Prop({ type: [Address] }) // Embedding Address as an array
  addresses: Address[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Review' }] })
  reviews: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Order' }] })
  orders: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'ShoppingList' }] })
  shoppingLists: mongoose.Types.ObjectId[];

  @Prop({type: mongoose.Types.ObjectId, ref: 'Cart' })
  cart: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
