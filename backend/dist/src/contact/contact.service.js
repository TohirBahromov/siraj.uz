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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContactService = class ContactService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const formattedPhone = data.phone.replace(/[\s-]/g, '');
        return this.prisma.contactSubmission.create({
            data: {
                name: data.name,
                message: data.message,
                phone: formattedPhone,
            },
        });
    }
    async findAll(page = 1, limit = 15) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.contactSubmission.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contactSubmission.count(),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
    async markAsRead(id) {
        try {
            return await this.prisma.contactSubmission.update({
                where: { id },
                data: { isRead: true },
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Xabar topilmadi: ID ${id}`);
        }
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactService);
//# sourceMappingURL=contact.service.js.map