import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
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

  @Prop()
  createdAt: Date;

  @Prop()
  status: string;

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

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
