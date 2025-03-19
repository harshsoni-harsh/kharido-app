import { IsDate, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDTO {
  @IsString()
  product: string; // Assuming product is passed as an ObjectId string

  @IsNumber()
  quantity: number;

  @IsDate()
  @Type(() => Date)
  timeAdded: Date;
}