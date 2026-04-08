import { UpdateCompanyInfoDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class CompanyService {
    private prisma;
    constructor(prisma: PrismaService);
    update(dto: UpdateCompanyInfoDto): Promise<{
        email: string;
        id: number;
        updatedAt: Date;
        latitude: Prisma.Decimal;
        longitude: Prisma.Decimal;
        address: string;
        phoneNumber: string;
        startDay: number;
        endDay: number;
        startAt: string;
        endAt: string;
    }>;
    getContact(): Promise<{
        email: string;
        address: string;
        phoneNumber: string;
        startDay: number;
        endDay: number;
        startAt: string;
        endAt: string;
    }>;
    getMap(): Promise<{
        latitude: Prisma.Decimal;
        longitude: Prisma.Decimal;
    } | {
        latitude: number;
        longitude: number;
    }>;
}
