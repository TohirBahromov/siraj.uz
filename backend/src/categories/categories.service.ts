import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const PUBLIC_LOCALES = ['en', 'uz', 'ru'] as const;
type PublicLocale = (typeof PUBLIC_LOCALES)[number];

function assertLocale(value: string): asserts value is PublicLocale {
  if (!PUBLIC_LOCALES.includes(value as PublicLocale)) {
    throw new BadRequestException(
      `locale must be one of: ${PUBLIC_LOCALES.join(', ')}`,
    );
  }
}

function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: PublicLocale,
): T {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === 'en') ??
    translations[0]
  );
}

/** Recursively builds a nested category tree */
function buildTree(
  flat: CategoryWithTranslations[],
  parentId: number | null,
  locale: PublicLocale,
): PublicCategoryNode[] {
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

type CategoryWithTranslations = {
  id: number;
  slug: string;
  imgUrl: string;
  parentId: number | null;
  level: number;
  translations: { locale: string; name: string; slug: string }[];
};

export type PublicCategoryNode = {
  id: number;
  slug: string;
  name: string;
  imgUrl: string;
  children: PublicCategoryNode[];
};

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Admin ────────────────────────────────────────────────────────────────

  async findAllAdmin() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
      include: { translations: true, children: { include: { translations: true } } },
    });
  }

  async findOneAdmin(id: number) {
    const cat = await this.prisma.category.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(dto: CreateCategoryDto) {
    this.validateTranslations(dto.translations);

    // Build a canonical slug from the first (or uz) translation
    const primaryName =
      dto.translations.find((t) => t.locale === 'uz')?.name ??
      dto.translations[0].name;
    const baseSlug = slugify(primaryName);

    // Ensure uniqueness at the category level
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
            slug: slugify(tr.name),
          })),
        },
      },
      include: { translations: true },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOneAdmin(id);
    if (dto.translations?.length) {
      this.validateTranslations(dto.translations);
    }

    const data: Record<string, unknown> = {};
    if (dto.imgUrl !== undefined) data.imgUrl = dto.imgUrl;
    if (dto.parentId !== undefined) {
      data.parentId = dto.parentId ?? null;
      data.level = await this.computeLevel(dto.parentId);
    }

    if (dto.translations?.length) {
      // Regenerate canonical slug from updated uz/first name
      const primaryName =
        dto.translations.find((t) => t.locale === 'uz')?.name ??
        dto.translations[0].name;
      const current = await this.findOneAdmin(id);
      const newBaseSlug = slugify(primaryName);
      // Only regenerate if the name actually changed
      if (newBaseSlug !== current.slug) {
        data.slug = await this.uniqueSlug(newBaseSlug, id);
      }

      data.translations = {
        deleteMany: {},
        create: dto.translations.map((tr) => ({
          locale: tr.locale,
          name: tr.name,
          slug: slugify(tr.name),
        })),
      };
    }

    if (Object.keys(data).length > 0) {
      await this.prisma.category.update({ where: { id }, data });
    }

    return this.findOneAdmin(id);
  }

  async remove(id: number) {
    await this.findOneAdmin(id);
    await this.prisma.category.delete({ where: { id } });
    return { ok: true };
  }

  // ─── Public ───────────────────────────────────────────────────────────────

  async findTree(locale: string, leafOnly = false): Promise<PublicCategoryNode[]> {
    assertLocale(locale);
    const all = await this.prisma.category.findMany({
      include: { translations: true },
      orderBy: { createdAt: 'asc' },
    });

    if (leafOnly) {
      // Return only categories with no children, flattened (no nesting)
      const parentIds = new Set(all.map((c) => c.parentId).filter(Boolean));
      const leaves = all.filter((c) => !parentIds.has(c.id));
      return leaves.map((c) => {
        const t = pickTranslation(c.translations, locale as PublicLocale);
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

  async findProductsBySlug(
    slug: string,
    locale: string,
    cursor: number | undefined,
    limit: number,
  ) {
    assertLocale(locale);

    // Resolve category (canonical slug or locale slug)
    const byCanonical = await this.prisma.category.findUnique({ where: { slug } });
    let categoryId: number | null = byCanonical?.id ?? null;

    if (!categoryId) {
      const tr = await this.prisma.categoryTranslation.findFirst({ where: { slug } });
      categoryId = tr?.categoryId ?? null;
    }
    if (!categoryId) return { products: [], nextCursor: null };

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
      const pt = pickTranslation(p.translations, locale as PublicLocale);
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

  async findBySlug(slug: string, locale: string) {
    assertLocale(locale);

    // Try matching the canonical slug first, then per-locale slugs
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
    if (!raw) throw new NotFoundException('Category not found');

    const t = pickTranslation(raw.translations, locale as PublicLocale);
    const products = raw.products.map((p) => {
      const pt = pickTranslation(p.translations, locale as PublicLocale);
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
      const ct = pickTranslation(c.translations, locale as PublicLocale);
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

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async findByLocaleSlug(slug: string) {
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

  private async computeLevel(parentId: number | null | undefined): Promise<number> {
    if (!parentId) return 0;
    const parent = await this.prisma.category.findUnique({ where: { id: parentId } });
    return parent ? parent.level + 1 : 0;
  }

  private async uniqueSlug(base: string, excludeId?: number): Promise<string> {
    let slug = base;
    let attempt = 0;
    while (true) {
      const existing = await this.prisma.category.findUnique({
        where: { slug },
      });
      if (!existing || existing.id === excludeId) return slug;
      attempt++;
      slug = `${base}-${attempt}`;
    }
  }

  private validateTranslations(translations: { locale: string }[]): void {
    const locales = translations.map((t) => t.locale);
    const missing = PUBLIC_LOCALES.filter((l) => !locales.includes(l));
    if (missing.length) {
      throw new BadRequestException(
        `Each category must have translations for: ${PUBLIC_LOCALES.join(', ')}. Missing: ${missing.join(', ')}`,
      );
    }
    const dup = locales.filter((l, i) => locales.indexOf(l) !== i);
    if (dup.length) {
      throw new BadRequestException('Duplicate locale in translations');
    }
  }
}
