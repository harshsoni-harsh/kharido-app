import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ShoppingListDocument = HydratedDocument<ShoppingList>;

@Schema()
export class Item {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  product: mongoose.Types.ObjectId;

  @Prop({ required: true })
  timeAdded: Date; // Timestamp for when the product was added
}

@Schema({ collection: 'ShoppingList' })
export class ShoppingList {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  description: string;

  @Prop({ type: [Item] })
  items: Item[];
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList);
