import { IsArray, IsDate, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  _id: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  products?: string[]; 

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topProducts?: string[]; 

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

  @IsOptional()
  @IsPositive()
  defaultTax:number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}
