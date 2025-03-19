import { IsNumber,IsOptional, IsString } from 'class-validator';

export class AddressDTO {
  @IsString()
  name: string;

  @IsString()
  street: string;

  @IsString()
  @IsOptional()
  landmark?: string;

  @IsNumber()
  pin: number;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  phone: string;
}