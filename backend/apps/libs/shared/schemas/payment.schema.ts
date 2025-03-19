
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type PaymentDocument = HydratedDocument<Payment>;




@Schema({collection: "Payment"})
export class Payment {

  @Prop({required: true})
  utr: string;


  @Prop()
  amount: string;


  @Prop({required: true})
  order: number;


  @Prop()
  createdAt : Date;

  @Prop()
  status: string;


  @Prop()
  description: string;

  @Prop()
  paymentMode: string;

  @Prop()
  updatedAt : Date;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);