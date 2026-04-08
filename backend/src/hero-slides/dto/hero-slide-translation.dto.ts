import { IsNotEmpty, IsString } from 'class-validator';

export class HeroSlideTranslationDto {
  @IsString()
  @IsNotEmpty()
  locale: string;

  @IsString()
  @IsNotEmpty()
  eyebrow: string;

  @IsString()
  @IsNotEmpty()
  headline: string;

  @IsString()
  @IsNotEmpty()
  subline: string;
}
