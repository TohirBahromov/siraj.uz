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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = require("../common/utils/slugify");
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
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPublic(placement, locale) {
        assertLocale(locale);
        const products = await this.prisma.product.findMany({
            where: { placement },
            orderBy: { createdAt: 'desc' },
            include: {
                translations: true,
                categories: { include: { translations: true } },
                contents: true,
            },
        });
        return products.map((p) => {
            const t = pickTranslation(p.translations, locale);
            if (!t) {
                throw new common_1.BadRequestException(`No translations for product ${p.id}`);
            }
            return {
                id: p.id,
                slug: p.slug,
                badge: t.badge ?? null,
                badgeColor: p.badgeColor,
                title: t.title,
                titleColor: p.titleColor,
                desc: t.desc,
                descColor: p.descColor,
                btn1Color: p.btn1Color,
                btn1BgColor: p.btn1BgColor,
                btn2Color: p.btn2Color,
                btn2BgColor: p.btn2BgColor,
                imgUrl: p.imgUrl,
                backgroundColor: p.backgroundColor,
                placement: p.placement,
                hasContent: p.contents.some((c) => c.locale === locale &&
                    Array.isArray(c.blocks) &&
                    c.blocks.length > 0),
                categories: p.categories.map((c) => {
                    const ct = pickTranslation(c.translations, locale);
                    return { id: c.id, slug: ct?.slug ?? c.slug, name: ct?.name ?? '' };
                }),
            };
        });
    }
    async findPublicBySlugId(slugId, locale) {
        assertLocale(locale);
        const id = (0, slugify_1.parseSlugId)(slugId);
        if (!id)
            throw new common_1.NotFoundException('Product not found');
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                translations: true,
                categories: { include: { translations: true } },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const t = pickTranslation(product.translations, locale);
        if (!t)
            throw new common_1.NotFoundException('Product not found');
        const categories = product.categories.map((c) => {
            const ct = pickTranslation(c.translations, locale);
            return { id: c.id, slug: ct?.slug ?? c.slug, name: ct?.name ?? '' };
        });
        return {
            id: product.id,
            slug: product.slug,
            badge: t.badge ?? null,
            badgeColor: product.badgeColor,
            title: t.title,
            titleColor: product.titleColor,
            desc: t.desc,
            descColor: product.descColor,
            btn1Color: product.btn1Color,
            btn1BgColor: product.btn1BgColor,
            btn2Color: product.btn2Color,
            btn2BgColor: product.btn2BgColor,
            imgUrl: product.imgUrl,
            backgroundColor: product.backgroundColor,
            placement: product.placement,
            categories,
        };
    }
    async findAllAdmin() {
        return this.prisma.product.findMany({
            orderBy: [{ placement: 'asc' }, { createdAt: 'desc' }],
            include: { translations: true, categories: true },
        });
    }
    async findOneAdmin(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { translations: true, categories: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async create(dto) {
        this.validateTranslations(dto.translations);
        const primaryTitle = dto.translations.find((t) => t.locale === 'uz')?.title ??
            dto.translations[0].title;
        const baseSlug = (0, slugify_1.slugify)(primaryTitle);
        const product = await this.prisma.product.create({
            data: {
                slug: `${baseSlug}-tmp-${Date.now()}`,
                placement: dto.placement,
                ...(dto.categoryIds?.length
                    ? { categories: { connect: dto.categoryIds.map((id) => ({ id })) } }
                    : {}),
                badgeColor: dto.badgeColor,
                titleColor: dto.titleColor,
                descColor: dto.descColor,
                btn1Color: dto.btn1Color,
                btn1BgColor: dto.btn1BgColor,
                btn2Color: dto.btn2Color,
                btn2BgColor: dto.btn2BgColor,
                imgUrl: dto.imgUrl,
                backgroundColor: dto.backgroundColor,
                translations: {
                    create: dto.translations.map((tr) => ({
                        locale: tr.locale,
                        badge: tr.badge ?? null,
                        title: tr.title,
                        desc: tr.desc,
                    })),
                },
            },
        });
        const finalSlug = (0, slugify_1.buildSlugId)(baseSlug, product.id);
        await this.prisma.product.update({
            where: { id: product.id },
            data: { slug: finalSlug },
        });
        return this.findOneAdmin(product.id);
    }
    async update(id, dto) {
        await this.findOneAdmin(id);
        if (dto.translations?.length) {
            this.validateTranslations(dto.translations);
        }
        const { translations, ...rest } = dto;
        const data = {};
        const keys = [
            'placement',
            'badgeColor',
            'titleColor',
            'descColor',
            'btn1Color',
            'btn1BgColor',
            'btn2Color',
            'btn2BgColor',
            'imgUrl',
            'backgroundColor',
        ];
        for (const key of keys) {
            const v = rest[key];
            if (v !== undefined) {
                data[key] = v;
            }
        }
        if (dto.categoryIds !== undefined) {
            data.categories = { set: dto.categoryIds.map((id) => ({ id })) };
        }
        if (translations?.length) {
            const primaryTitle = translations.find((t) => t.locale === 'uz')?.title ??
                translations[0].title;
            data.slug = (0, slugify_1.buildSlugId)((0, slugify_1.slugify)(primaryTitle), id);
            data.translations = {
                deleteMany: {},
                create: translations.map((tr) => ({
                    locale: tr.locale,
                    badge: tr.badge ?? null,
                    title: tr.title,
                    desc: tr.desc,
                })),
            };
        }
        if (Object.keys(data).length > 0) {
            await this.prisma.product.update({ where: { id }, data });
        }
        return this.findOneAdmin(id);
    }
    async remove(id) {
        await this.findOneAdmin(id);
        await this.prisma.product.delete({ where: { id } });
        return { ok: true };
    }
    async getContent(productId, locale) {
        await this.findOneAdmin(productId);
        const row = await this.prisma.productContent.findUnique({
            where: { productId_locale: { productId, locale } },
        });
        return { productId, locale, blocks: (row?.blocks ?? []) };
    }
    async upsertContent(productId, locale, blocks) {
        await this.findOneAdmin(productId);
        await this.prisma.productContent.upsert({
            where: { productId_locale: { productId, locale } },
            update: { blocks: blocks },
            create: { productId, locale, blocks: blocks },
        });
        return { ok: true };
    }
    async getPublicContent(slugId, locale) {
        assertLocale(locale);
        const id = (0, slugify_1.parseSlugId)(slugId);
        if (!id)
            throw new common_1.NotFoundException('Product not found');
        const rows = await this.prisma.productContent.findMany({
            where: { productId: id },
        });
        const pick = rows.find((r) => r.locale === locale) ??
            rows.find((r) => r.locale === 'en') ??
            rows[0];
        return { blocks: (pick?.blocks ?? []) };
    }
    validateTranslations(translations) {
        const locales = translations.map((t) => t.locale);
        const missing = PUBLIC_LOCALES.filter((l) => !locales.includes(l));
        if (missing.length) {
            throw new common_1.BadRequestException(`Each product must include translations for: ${PUBLIC_LOCALES.join(', ')}. Missing: ${missing.join(', ')}`);
        }
        const dup = locales.filter((l, i) => locales.indexOf(l) !== i);
        if (dup.length) {
            throw new common_1.BadRequestException('Duplicate locale in translations');
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map