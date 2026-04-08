import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

const LOCALES = ['en', 'uz', 'ru'] as const;

export class ProductTranslationDto {
  @IsString()
  @IsIn(LOCALES)
  locale!: string;

  @IsOptional()
  @IsString()
  badge?: string;

  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  desc!: string;
}
