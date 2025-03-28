import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class CartItem {
  @Prop({  type: mongoose.Types.ObjectId, ref: 'Product'  })
  product: mongoose.Types.ObjectId;

  @Prop()
  quantity: number;

  @Prop({ required: true })
  timeAdded: Date; // Timestamp for when the product was added
}

@Schema({ collection: 'Cart' })
export class Cart {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [{  type: mongoose.Types.ObjectId, ref: 'CartItem'  }] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
