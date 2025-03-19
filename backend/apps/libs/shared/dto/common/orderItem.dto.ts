import { IsNumber, IsString } from 'class-validator';

export class OrderItemDTO {
  @IsString()
  product: string; // Assuming product is passed as an ObjectId string

  @IsNumber()
  quantity: number;

  @IsNumber()
  originalPrice: number;

  @IsNumber()
  finalPrice: number;
}