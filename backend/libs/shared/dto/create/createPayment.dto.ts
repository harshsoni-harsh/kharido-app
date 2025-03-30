import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDTO {
  @IsString()
  utr: string;

  @IsString()
  @IsOptional()
  amount?: string;

  @IsNumber()
  order: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  paymentMode?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}
