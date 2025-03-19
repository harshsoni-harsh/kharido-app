import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDTO {
  @IsString()
  userName: string;

  @IsString()
  userEmail: string;

  @IsString()
  product: string; // Assuming product is passed as an ObjectId string

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  status?: string; // For approval

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imgLinks?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastUpdateAt?: Date;

  @IsArray()
  @IsOptional()
  specification?: Array<{ property: string; value: string }>;
}