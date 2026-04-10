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
exports.CategoriesService = void 0;
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
    return (translations.find((t) => t.locale === locale) ??
        translations.find((t) => t.locale === 'en') ??
        translations[0]);
}
function buildTree(flat, parentId, locale) {
    return flat
        .filter((c) => c.parentId === parentId)
        .map((c) => {
        const t = pickTranslation(c.translations, locale);
        return {
            id: c.id,
            slug: t?.slug ?? c.slug,
            name: t?.name ?? '',
            imgUrl: c.imgUrl,
            children: buildTree(flat, c.id, locale),
        };
    });
}
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllAdmin() {
        return this.prisma.category.findMany({
            orderBy: { createdAt: 'asc' },
            include: { translations: true, children: { include: { translations: true } } },
        });
    }
    async findOneAdmin(id) {
        const cat = await this.prisma.category.findUnique({
            where: { id },
            include: { translations: true },
        });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return cat;
    }
    async create(dto) {
        this.validateTranslations(dto.translations);
        const primaryName = dto.translations.find((t) => t.locale === 'uz')?.name ??
            dto.translations[0].name;
        const baseSlug = (0, slugify_1.slugify)(primaryName);
        const canonicalSlug = await this.uniqueSlug(baseSlug);
        const level = await this.computeLevel(dto.parentId);
        return this.prisma.category.create({
            data: {
                slug: canonicalSlug,
                imgUrl: dto.imgUrl,
                parentId: dto.parentId ?? null,
                level,
                translations: {
                    create: dto.translations.map((tr) => ({
                        locale: tr.locale,
                        name: tr.name,
                        slug: (0, slugify_1.slugify)(tr.name),
                    })),
                },
            },
            include: { translations: true },
        });
    }
    async update(id, dto) {
        await this.findOneAdmin(id);
        if (dto.translations?.length) {
            this.validateTranslations(dto.translations);
        }
        const data = {};
        if (dto.imgUrl !== undefined)
            data.imgUrl = dto.imgUrl;
        if (dto.parentId !== undefined) {
            data.parentId = dto.parentId ?? null;
            data.level = await this.computeLevel(dto.parentId);
        }
        if (dto.translations?.length) {
            const primaryName = dto.translations.find((t) => t.locale === 'uz')?.name ??
                dto.translations[0].name;
            const current = await this.findOneAdmin(id);
            const newBaseSlug = (0, slugify_1.slugify)(primaryName);
            if (newBaseSlug !== current.slug) {
                data.slug = await this.uniqueSlug(newBaseSlug, id);
            }
            data.translations = {
                deleteMany: {},
                create: dto.translations.map((tr) => ({
                    locale: tr.locale,
                    name: tr.name,
                    slug: (0, slugify_1.slugify)(tr.name),
                })),
            };
        }
        if (Object.keys(data).length > 0) {
            await this.prisma.category.update({ where: { id }, data });
        }
        return this.findOneAdmin(id);
    }
    async remove(id) {
        await this.findOneAdmin(id);
        await this.prisma.category.delete({ where: { id } });
        return { ok: true };
    }
    async findTree(locale, leafOnly = false) {
        assertLocale(locale);
        const all = await this.prisma.category.findMany({
            include: { translations: true },
            orderBy: { createdAt: 'asc' },
        });
        if (leafOnly) {
            const parentIds = new Set(all.map((c) => c.parentId).filter(Boolean));
            const leaves = all.filter((c) => !parentIds.has(c.id));
            return leaves.map((c) => {
                const t = pickTranslation(c.translations, locale);
                return {
                    id: c.id,
                    slug: t?.slug ?? c.slug,
                    name: t?.name ?? '',
                    imgUrl: c.imgUrl,
                    children: [],
                };
            });
        }
        return buildTree(all, null, locale);
    }
    async findProductsBySlug(slug, locale, cursor, limit) {
        assertLocale(locale);
        const byCanonical = await this.prisma.category.findUnique({ where: { slug } });
        let categoryId = byCanonical?.id ?? null;
        if (!categoryId) {
            const tr = await this.prisma.categoryTranslation.findFirst({ where: { slug } });
            categoryId = tr?.categoryId ?? null;
        }
        if (!categoryId)
            return { products: [], nextCursor: null };
        const rows = await this.prisma.product.findMany({
            where: { categories: { some: { id: categoryId } } },
            orderBy: { createdAt: 'desc' },
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            include: { translations: true },
        });
        const hasMore = rows.length > limit;
        const items = hasMore ? rows.slice(0, limit) : rows;
        const nextCursor = hasMore ? items[items.length - 1].id : null;
        const products = items.map((p) => {
            const pt = pickTranslation(p.translations, locale);
            return {
                id: p.id,
                slug: p.slug,
                title: pt?.title ?? '',
                badge: pt?.badge ?? null,
                imgUrl: p.imgUrl,
                badgeColor: p.badgeColor,
                titleColor: p.titleColor,
                backgroundColor: p.backgroundColor,
                descColor: p.descColor,
                desc: pt?.desc ?? '',
                btn1Color: p.btn1Color,
                btn1BgColor: p.btn1BgColor,
                btn2Color: p.btn2Color,
                btn2BgColor: p.btn2BgColor,
                placement: p.placement,
            };
        });
        return { products, nextCursor };
    }
    async findBySlug(slug, locale) {
        assertLocale(locale);
        const byCanonical = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                translations: true,
                children: { include: { translations: true } },
                products: {
                    include: { translations: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        const raw = byCanonical ?? (await this.findByLocaleSlug(slug));
        if (!raw)
            throw new common_1.NotFoundException('Category not found');
        const t = pickTranslation(raw.translations, locale);
        const products = raw.products.map((p) => {
            const pt = pickTranslation(p.translations, locale);
            return {
                id: p.id,
                slug: p.slug,
                title: pt?.title ?? '',
                badge: pt?.badge ?? null,
                imgUrl: p.imgUrl,
                badgeColor: p.badgeColor,
                titleColor: p.titleColor,
            };
        });
        const children = raw.children.map((c) => {
            const ct = pickTranslation(c.translations, locale);
            return {
                id: c.id,
                slug: ct?.slug ?? c.slug,
                name: ct?.name ?? '',
                imgUrl: c.imgUrl,
            };
        });
        return {
            id: raw.id,
            slug: t?.slug ?? raw.slug,
            name: t?.name ?? '',
            imgUrl: raw.imgUrl,
            children,
            products,
        };
    }
    async findByLocaleSlug(slug) {
        const translation = await this.prisma.categoryTranslation.findFirst({
            where: { slug },
            include: {
                category: {
                    include: {
                        translations: true,
                        children: { include: { translations: true } },
                        products: {
                            include: { translations: true },
                            orderBy: { createdAt: 'desc' },
                        },
                    },
                },
            },
        });
        return translation?.category ?? null;
    }
    async computeLevel(parentId) {
        if (!parentId)
            return 0;
        const parent = await this.prisma.category.findUnique({ where: { id: parentId } });
        return parent ? parent.level + 1 : 0;
    }
    async uniqueSlug(base, excludeId) {
        let slug = base;
        let attempt = 0;
        while (true) {
            const existing = await this.prisma.category.findUnique({
                where: { slug },
            });
            if (!existing || existing.id === excludeId)
                return slug;
            attempt++;
            slug = `${base}-${attempt}`;
        }
    }
    validateTranslations(translations) {
        const locales = translations.map((t) => t.locale);
        const missing = PUBLIC_LOCALES.filter((l) => !locales.includes(l));
        if (missing.length) {
            throw new common_1.BadRequestException(`Each category must have translations for: ${PUBLIC_LOCALES.join(', ')}. Missing: ${missing.join(', ')}`);
        }
        const dup = locales.filter((l, i) => locales.indexOf(l) !== i);
        if (dup.length) {
            throw new common_1.BadRequestException('Duplicate locale in translations');
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map