import { IsInt, IsNotEmpty, Min } from 'class-validator';
export class ProductDto {
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  categories: number[];
}
