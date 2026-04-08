import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const email = this.config.getOrThrow<string>('ADMIN_EMAIL').toLowerCase();
    const hash = this.config.getOrThrow<string>('ADMIN_PASSWORD_HASH');

    console.log(email, hash, dto);
    if (dto.email.toLowerCase() !== email) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(dto.password, hash);
    console.log(ok);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync({ sub: 'admin', email: dto.email });
    return { accessToken: token };
  }
}
