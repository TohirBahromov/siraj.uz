import { CompanyService } from './company.service';
import { UpdateCompanyInfoDto } from './dto/update-company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
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
        latitude: import("@prisma/client-runtime-utils").Decimal;
        longitude: import("@prisma/client-runtime-utils").Decimal;
    } | {
        latitude: number;
        longitude: number;
    }>;
    updateInfo(updateDto: UpdateCompanyInfoDto): Promise<{
        email: string;
        id: number;
        updatedAt: Date;
        latitude: import("@prisma/client-runtime-utils").Decimal;
        longitude: import("@prisma/client-runtime-utils").Decimal;
        address: string;
        phoneNumber: string;
        startDay: number;
        endDay: number;
        startAt: string;
        endAt: string;
    }>;
}
