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
exports.StaffMembersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PUBLIC_LOCALES = ['en', 'uz', 'ru'];
function assertLocale(value) {
    if (!PUBLIC_LOCALES.includes(value)) {
        throw new common_1.BadRequestException(`locale must be one of: ${PUBLIC_LOCALES.join(', ')}`);
    }
}
function pickTranslation(translations, locale) {
    return (translations.find((t) => t.locale === locale) ??
        translations.find((t) => t.locale === 'en') ??
        translations[0]);
}
let StaffMembersService = class StaffMembersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPublic(locale) {
        assertLocale(locale);
        const members = await this.prisma.staffMember.findMany({
            orderBy: { order: 'asc' },
            include: { translations: true },
        });
        return members.map((m) => {
            const t = pickTranslation(m.translations, locale);
            return {
                id: m.id,
                imageUrl: m.imageUrl,
                name: t?.name ?? '',
                position: t?.position ?? '',
            };
        });
    }
    async findAllAdmin(page = 1, limit = 15) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.staffMember.findMany({
                skip,
                take: limit,
                orderBy: { order: 'asc' },
                include: { translations: true },
            }),
            this.prisma.staffMember.count(),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                lastPage: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async findOneAdmin(id) {
        const member = await this.prisma.staffMember.findUnique({
            where: { id },
            include: { translations: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Staff member not found');
        return member;
    }
    async create(dto) {
        const member = await this.prisma.staffMember.create({
            data: {
                imageUrl: dto.imageUrl,
                order: dto.order ?? 0,
                translations: {
                    create: dto.translations.map((t) => ({
                        locale: t.locale,
                        name: t.name,
                        position: t.position,
                    })),
                },
            },
        });
        return this.findOneAdmin(member.id);
    }
    async update(id, dto) {
        await this.findOneAdmin(id);
        const { translations, ...rest } = dto;
        const data = {};
        if (rest.imageUrl !== undefined)
            data.imageUrl = rest.imageUrl;
        if (rest.order !== undefined)
            data.order = rest.order;
        if (translations?.length) {
            data.translations = {
                deleteMany: {},
                create: translations.map((t) => ({
                    locale: t.locale,
                    name: t.name,
                    position: t.position,
                })),
            };
        }
        if (Object.keys(data).length > 0) {
            await this.prisma.staffMember.update({ where: { id }, data });
        }
        return this.findOneAdmin(id);
    }
    async remove(id) {
        await this.findOneAdmin(id);
        await this.prisma.staffMember.delete({ where: { id } });
        return { ok: true };
    }
};
exports.StaffMembersService = StaffMembersService;
exports.StaffMembersService = StaffMembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaffMembersService);
//# sourceMappingURL=staff-members.service.js.map