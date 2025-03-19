import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemDTO {
  @IsString()
  product: string; // Assuming product is passed as an ObjectId string

  @IsDate()
  @Type(() => Date)
  timeAdded: Date;
}