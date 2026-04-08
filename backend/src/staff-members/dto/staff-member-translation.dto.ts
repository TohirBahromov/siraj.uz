import { IsIn, IsString, MinLength } from 'class-validator';

const LOCALES = ['en', 'uz', 'ru'] as const;

export class StaffMemberTranslationDto {
  @IsIn(LOCALES)
  locale!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  position!: string;
}
