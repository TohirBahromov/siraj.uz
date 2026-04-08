import {
  IsArray,
  IsHexColor,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HeroSlideTranslationDto } from './hero-slide-translation.dto';

export class CreateHeroSlideDto {
  @IsString()
  @IsNotEmpty()
  videoSrc: string;

  @IsHexColor()
  @IsNotEmpty()
  eyebrowColor: string;

  @IsHexColor()
  @IsNotEmpty()
  headlineColor: string;

  @IsHexColor()
  @IsNotEmpty()
  sublineColor: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroSlideTranslationDto)
  translations: HeroSlideTranslationDto[];
}
