import { IsNumber } from 'class-validator';

export class TotalAmountDTO {
  @IsNumber()
  total: number;

  @IsNumber()
  tax: number;

  @IsNumber()
  netAmount: number;
}
