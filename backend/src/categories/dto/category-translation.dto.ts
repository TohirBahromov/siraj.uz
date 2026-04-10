import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const LOCALES = ['en', 'uz', 'ru'] as const;

export class CategoryTranslationDto {
  @IsIn(LOCALES)
  locale: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
