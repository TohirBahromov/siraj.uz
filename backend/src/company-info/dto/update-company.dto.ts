import { IsNumber, IsString, IsEmail } from 'class-validator';

export class UpdateCompanyInfoDto {
  @IsNumber()
  latitude: number = 0;

  @IsNumber()
  longitude: number = 0;

  @IsString()
  address: string = '';

  @IsString()
  phoneNumber: string = '';

  @IsEmail()
  email: string = '';

  @IsNumber()
  startDay: number = 0;

  @IsNumber()
  endDay: number = 0;

  @IsString()
  startAt: string = '';

  @IsString()
  endAt: string = '';
}
