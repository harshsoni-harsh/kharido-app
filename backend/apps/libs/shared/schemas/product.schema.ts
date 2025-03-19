import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: 'Product' })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop()
  sku: string;

  @Prop()
  description: string;

  @Prop()
  minQuantity: number;

  @Prop()
  maxQuantity: number;

  @Prop()
  stock: number;

  @Prop()
  price: number;

  @Prop()
  discount: number;

  @Prop()
  taxPercent: number;

  @Prop()
  createdAt: Date;

  @Prop()
  imageLinks: string[];

  @Prop()
  returnPolicy: string;

  @Prop()
  replacementPolicy: string;

  @Prop()
  warrantyPolicy: string;

  @Prop()
  searchTags: string[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Category' }] })
  category: mongoose.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Review' }] })
  reviews: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ property: String, value: String }],
  })
  specification: { property: string; value: string }[];

  @Prop({
    type: [{ property: String, value: String }],
  })
  @Prop({
    type: [{ property: String, value: String }],
  })
  variants: { property: string; value: string }[]; // for objects like tshirt, like sizes s,m l, xl

  @Prop()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
