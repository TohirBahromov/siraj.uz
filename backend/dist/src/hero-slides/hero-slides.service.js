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
exports.HeroSlidesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PUBLIC_LOCALES = ['en', 'uz', 'ru'];
function assertLocale(value) {
    if (!PUBLIC_LOCALES.includes(value)) {
        throw new common_1.BadRequestException(`locale must be one of: ${PUBLIC_LOCALES.join(', ')}`);
    }
}
function pickTranslation(translations, locale) {
    const direct = translations.find((t) => t.locale === locale);
    if (direct)
        return direct;
    const fallback = translations.find((t) => t.locale === 'en');
    if (fallback)
        return fallback;
    return translations[0];
}
let HeroSlidesService = class HeroSlidesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPublic(locale) {
        assertLocale(locale);
        const slides = await this.prisma.heroSlide.findMany({
            orderBy: { createdAt: 'asc' },
            include: { translations: true },
        });
        return slides.map((s) => {
            const t = pickTranslation(s.translations, locale);
            if (!t) {
                throw new common_1.BadRequestException(`No translations for hero slide ${s.id}`);
            }
            return {
                id: s.id,
                videoSrc: s.videoSrc,
                eyebrowColor: s.eyebrowColor,
                headlineColor: s.headlineColor,
                sublineColor: s.sublineColor,
                eyebrow: t.eyebrow,
                headline: t.headline,
                subline: t.subline,
            };
        });
    }
    async findAllAdmin() {
        return this.prisma.heroSlide.findMany({
            orderBy: { createdAt: 'desc' },
            include: { translations: true },
        });
    }
    async findOneAdmin(id) {
        const slide = await this.prisma.heroSlide.findUnique({
            where: { id },
            include: { translations: true },
        });
        if (!slide)
            throw new common_1.NotFoundException('Hero slide not found');
        return slide;
    }
    async create(dto) {
        this.validateTranslations(dto.translations);
        const slide = await this.prisma.heroSlide.create({
            data: {
                videoSrc: dto.videoSrc,
                eyebrowColor: dto.eyebrowColor,
                headlineColor: dto.headlineColor,
                sublineColor: dto.sublineColor,
                translations: {
                    create: dto.translations.map((tr) => ({
                        locale: tr.locale,
                        eyebrow: tr.eyebrow,
                        headline: tr.headline,
                        subline: tr.subline,
                    })),
                },
            },
        });
        return this.findOneAdmin(slide.id);
    }
    async update(id, dto) {
        await this.findOneAdmin(id);
        if (dto.translations?.length) {
            this.validateTranslations(dto.translations);
        }
        const { translations, ...rest } = dto;
        const data = {};
        const keys = ['videoSrc', 'eyebrowColor', 'headlineColor', 'sublineColor'];
        for (const key of keys) {
            const v = rest[key];
            if (v !== undefined) {
                data[key] = v;
            }
        }
        if (translations?.length) {
            data.translations = {
                deleteMany: {},
                create: translations.map((tr) => ({
                    locale: tr.locale,
                    eyebrow: tr.eyebrow,
                    headline: tr.headline,
                    subline: tr.subline,
                })),
            };
        }
        if (Object.keys(data).length > 0) {
            await this.prisma.heroSlide.update({ where: { id }, data });
        }
        return this.findOneAdmin(id);
    }
    async remove(id) {
        await this.findOneAdmin(id);
        await this.prisma.heroSlide.delete({ where: { id } });
        return { ok: true };
    }
    validateTranslations(translations) {
        const locales = translations.map((t) => t.locale);
        const missing = PUBLIC_LOCALES.filter((l) => !locales.includes(l));
        if (missing.length) {
            throw new common_1.BadRequestException(`Each hero slide must include translations for: ${PUBLIC_LOCALES.join(', ')}. Missing: ${missing.join(', ')}`);
        }
        const dup = locales.filter((l, i) => locales.indexOf(l) !== i);
        if (dup.length) {
            throw new common_1.BadRequestException('Duplicate locale in translations');
        }
    }
};
exports.HeroSlidesService = HeroSlidesService;
exports.HeroSlidesService = HeroSlidesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HeroSlidesService);
//# sourceMappingURL=hero-slides.service.js.map