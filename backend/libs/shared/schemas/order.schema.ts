import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Address } from './user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    required: true,
  })
  product: mongoose.Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  originalPrice: number;

  @Prop({ required: true })
  finalPrice: number;
}

@Schema({ collection: 'Order' })
export class Order {
  @Prop()
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({immutable:true})
  createdAt: Date;
  
  @Prop({ type: Address })
  address: Address;

  @Prop({
    type: [{ property: String, time: Date }],
  })
  status: { property: string; time: Date }[];

o
  @Prop()
  trackingLink: string;

  @Prop()
  paymentMode: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Payment' }] })
  payment: mongoose.Types.ObjectId;

  @Prop({ required: true })
  items: OrderItem[];

  @Prop({
    type: {
      total: { type: Number, required: true },
      tax: { type: Number, required: true },
      netAmount: { type: Number, required: true },
    },
  })
  totalAmount: { total: number; tax: number; netAmount: number };

 
}

export const OrderSchema = SchemaFactory.createForClass(Order);
