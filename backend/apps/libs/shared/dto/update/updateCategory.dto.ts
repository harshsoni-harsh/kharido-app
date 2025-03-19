import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  products?: string[]; // Assuming products are passed as ObjectId strings

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topProducts?: string[]; // Assuming topProducts are passed as ObjectId strings

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageLinks?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  searchTags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reviews?: string[]; // Assuming reviews are passed as ObjectId strings

  @IsArray()
  @IsOptional()
  specification?: Array<{ property: string; value: string }>;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}