import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ collection: 'Review' })
export class Review {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    required: true,
  })
  product: mongoose.Schema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  status: string; // for approval

  @Prop()
  imgLinks: string[];

  @Prop()
  tags: string[];

  @Prop()
  rating: number;

  @Prop()
  description: string;

  @Prop()
  quantity: number;

  @Prop()
  createdAt: Date;

  @Prop()
  lastUpdateAt: Date;

  @Prop({
    type: [{ property: String, value: String }],
  })
  specification: { property: string; value: string }[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
