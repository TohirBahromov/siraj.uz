import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ProductPlacement } from '@prisma/client';
import { ProductTranslationDto } from './product-translation.dto';

export class CreateProductDto {
  @IsEnum(ProductPlacement)
  placement!: ProductPlacement;

  @IsString()
  @MinLength(1)
  badgeColor!: string;

  @IsString()
  @MinLength(1)
  titleColor!: string;

  @IsString()
  @MinLength(1)
  descColor!: string;

  @IsString()
  @MinLength(1)
  btn1Color!: string;

  @IsString()
  @MinLength(1)
  btn1BgColor!: string;

  @IsString()
  @MinLength(1)
  btn2Color!: string;

  @IsString()
  @MinLength(1)
  btn2BgColor!: string;

  @IsString()
  @MinLength(1)
  imgUrl!: string;

  @IsString()
  @MinLength(1)
  backgroundColor!: string;

  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations!: ProductTranslationDto[];
}
