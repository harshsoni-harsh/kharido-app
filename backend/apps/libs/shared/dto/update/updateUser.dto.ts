import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDTO } from '../common/address.dto';



export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDTO)
  @IsOptional()
  addresses?: AddressDTO[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  reviews?: string[]; 

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  orders?: string[]; 
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  shoppingLists?: string[]; 

  @IsString()
  @IsOptional()
  cart?: string; 
}