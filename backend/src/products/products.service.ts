import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductPlacement } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const PUBLIC_LOCALES = ['en', 'uz', 'ru'] as const;
type PublicLocale = (typeof PUBLIC_LOCALES)[number];

function assertLocale(value: string): asserts value is PublicLocale {
  if (!PUBLIC_LOCALES.includes(value as PublicLocale)) {
    throw new BadRequestException(
      `locale must be one of: ${PUBLIC_LOCALES.join(', ')}`,
    );
  }
}

function pickTranslation(
  translations: { locale: string; badge: string | null; title: string; desc: string }[],
  locale: PublicLocale,
) {
  const direct = translations.find((t) => t.locale === locale);
  if (direct) return direct;
  const fallback = translations.find((t) => t.locale === 'en');
  if (fallback) return fallback;
  return translations[0];
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(placement: ProductPlacement, locale: string) {
    assertLocale(locale);
    const products = await this.prisma.product.findMany({
      where: { placement },
      orderBy: { createdAt: 'desc' },
      include: { translations: true },
    });
    return products.map((p) => {
      const t = pickTranslation(p.translations, locale);
      if (!t) {
        throw new BadRequestException(
          `No translations for product ${p.id}`,
        );
      }
      return {
        id: p.id,
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
      };
    });
  }

  async findAllAdmin() {
    return this.prisma.product.findMany({
      orderBy: [{ placement: 'asc' }, { createdAt: 'desc' }],
      include: { translations: true },
    });
  }

  async findOneAdmin(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    this.validateTranslations(dto.translations);
    const product = await this.prisma.product.create({
      data: {
        placement: dto.placement,
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
    return this.findOneAdmin(product.id);
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOneAdmin(id);
    if (dto.translations?.length) {
      this.validateTranslations(dto.translations);
    }

    const { translations, ...rest } = dto;
    const data: Record<string, unknown> = {};

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
    ] as const;
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

  async remove(id: number) {
    await this.findOneAdmin(id);
    await this.prisma.product.delete({ where: { id } });
    return { ok: true };
  }

  private validateTranslations(translations: { locale: string }[]): void {
    const locales = translations.map((t) => t.locale);
    const missing = PUBLIC_LOCALES.filter((l) => !locales.includes(l));
    if (missing.length) {
      throw new BadRequestException(
        `Each product must include translations for: ${PUBLIC_LOCALES.join(', ')}. Missing: ${missing.join(', ')}`,
      );
    }
    const dup = locales.filter((l, i) => locales.indexOf(l) !== i);
    if (dup.length) {
      throw new BadRequestException('Duplicate locale in translations');
    }
  }
}
