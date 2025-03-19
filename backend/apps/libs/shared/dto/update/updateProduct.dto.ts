import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  minQuantity?: number;

  @IsNumber()
  @IsOptional()
  maxQuantity?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  taxPercent?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageLinks?: string[];

  @IsString()
  @IsOptional()
  returnPolicy?: string;

  @IsString()
  @IsOptional()
  replacementPolicy?: string;

  @IsString()
  @IsOptional()
  warrantyPolicy?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  searchTags?: string[];

  @IsArray()
  @IsOptional()
  reviews?: string[]; // Assuming reviews are passed as ObjectId strings

  @IsArray()
  @IsOptional()
  specification?: Array<{ property: string; value: string }>;

  @IsArray()
  @IsOptional()
  variants?: Array<{ property: string; value: string }>;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}
