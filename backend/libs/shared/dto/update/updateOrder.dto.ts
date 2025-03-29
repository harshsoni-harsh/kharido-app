import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDTO } from '../common/orderItem.dto';
import { TotalAmountDTO } from '../common/totalAmount.dto';

export class UpdateOrderDTO {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  trackingLink?: string;

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
  payment?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  @IsOptional()
  items?: OrderItemDTO[];

  @ValidateNested()
  @Type(() => TotalAmountDTO)
  @IsOptional()
  totalAmount?: TotalAmountDTO;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}
