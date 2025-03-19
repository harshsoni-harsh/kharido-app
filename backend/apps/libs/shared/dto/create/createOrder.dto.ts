import {
  IsArray,
  IsDate,
  IsOptional,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TotalAmountDTO } from '../common/totalAmount.dto';
import { OrderItemDTO } from '../common/orderItem.dto';

export class CreateOrderDTO {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  trackingLink?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentMode?: string;

  @IsString()
  @IsOptional()
  payment?: string; // Assuming payment is passed as an ObjectId string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  @ValidateNested()
  @Type(() => TotalAmountDTO)
  totalAmount: TotalAmountDTO;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}
