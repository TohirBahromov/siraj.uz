import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly config;
    private readonly jwt;
    constructor(config: ConfigService, jwt: JwtService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
}
