import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { StaffMemberTranslationDto } from './staff-member-translation.dto';

export class UpdateStaffMemberDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  imageUrl?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @ValidateNested({ each: true })
  @Type(() => StaffMemberTranslationDto)
  @IsOptional()
  translations?: StaffMemberTranslationDto[];
}
