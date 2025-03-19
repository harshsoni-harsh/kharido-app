import { IsArray, IsDate, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDTO } from '../common/cart-item.dto';


export class CreateCartDTO {
  @IsString()
  user: string;

  @IsString()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDTO)
  items: CartItemDTO[];
}