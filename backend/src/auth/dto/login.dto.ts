import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  /** Compared case-insensitively to ADMIN_EMAIL (any string, not strictly RFC email). */
  @IsString()
  @MinLength(1)
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
