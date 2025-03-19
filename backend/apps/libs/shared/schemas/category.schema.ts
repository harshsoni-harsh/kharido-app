import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ collection: 'Category' })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop()
  sku: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Product' }] })
  products: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Product' }] })
  topProducts: mongoose.Types.ObjectId[];

  @Prop()
  createdAt: Date;

  @Prop()
  imageLinks: string[];

  @Prop()
  searchTags: string[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Review' }] })
  reviews: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ property: String, value: String }],
  })
  specification: { property: string; value: string }[];

  @Prop()
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
