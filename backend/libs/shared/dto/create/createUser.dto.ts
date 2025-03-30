import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  gender?: string;

  // No need to include nested objects for simplicity
  addresses?: any[]; // Just for demonstration (in a real app, use Address DTOs)
  reviews?: any[]; // Same for reviews, orders, etc.
  orders?: any[];
  shoppingLists?: any[];
  cart?: any;
}
