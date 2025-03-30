import {
  IsArray,
  IsDate,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDTO } from '../common/cart-item.dto';

export class UpdateCartDTO {
  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  @IsOptional()
  items?: CartItemDTO[];
}
