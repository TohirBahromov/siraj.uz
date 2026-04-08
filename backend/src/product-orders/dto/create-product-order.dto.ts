import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateProductOrderDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
