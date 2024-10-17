import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';

// Define the DTO for the product object
export class TransactionProductDto {
  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}

// Define the DTO for the entire request payload
export class TransactionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionProductDto)
  products: TransactionProductDto[];
}
