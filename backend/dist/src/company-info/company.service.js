"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CompanyService = class CompanyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async update(dto) {
        const ID = 1;
        const data = {
            ...dto,
            latitude: new client_1.Prisma.Decimal(dto.latitude ?? 0),
            longitude: new client_1.Prisma.Decimal(dto.longitude ?? 0),
        };
        return this.prisma.companyInfo.upsert({
            where: { id: ID },
            update: data,
            create: {
                id: ID,
                ...data,
            },
        });
    }
    async getContact() {
        const contact = await this.prisma.companyInfo.findFirst({
            select: {
                email: true,
                phoneNumber: true,
                address: true,
                startAt: true,
                endAt: true,
                startDay: true,
                endDay: true,
            },
        });
        if (!contact) {
            return {
                email: '',
                phoneNumber: '',
                address: '',
                startAt: '09:00',
                endAt: '18:00',
                startDay: 0,
                endDay: 4,
            };
        }
        return contact;
    }
    async getMap() {
        const mapData = await this.prisma.companyInfo.findFirst({
            select: {
                latitude: true,
                longitude: true,
            },
        });
        if (!mapData) {
            return {
                latitude: 41.3111,
                longitude: 69.2797,
            };
        }
        return mapData;
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyService);
//# sourceMappingURL=company.service.js.map