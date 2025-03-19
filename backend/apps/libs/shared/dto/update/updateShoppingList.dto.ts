import { IsArray, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemDTO } from '../common/item.dto';

export class UpdateShoppingListDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;



  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  @IsOptional()
  items?: ItemDTO[];
}