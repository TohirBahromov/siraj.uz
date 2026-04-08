import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';

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
  translations: { locale: string; eyebrow: string; headline: string; subline: string }[],
  locale: PublicLocale,
) {
  const direct = translations.find((t) => t.locale === locale);
  if (direct) return direct;
  const fallback = translations.find((t) => t.locale === 'en');
  if (fallback) return fallback;
  return translations[0];
}

@Injectable()
export class HeroSlidesService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(locale: string) {
    assertLocale(locale);
    const slides = await this.prisma.heroSlide.findMany({
      orderBy: { createdAt: 'asc' },
      include: { translations: true },
    });
    return slides.map((s) => {
      const t = pickTranslation(s.translations, locale);
      if (!t) {
        throw new BadRequestException(
          `No translations for hero slide ${s.id}`,
        );
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

  async findOneAdmin(id: number) {
    const slide = await this.prisma.heroSlide.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!slide) throw new NotFoundException('Hero slide not found');
    return slide;
  }

  async create(dto: CreateHeroSlideDto) {
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

  async update(id: number, dto: UpdateHeroSlideDto) {
    await this.findOneAdmin(id);
    if (dto.translations?.length) {
      this.validateTranslations(dto.translations);
    }

    const { translations, ...rest } = dto;
    const data: Record<string, unknown> = {};

    const keys = ['videoSrc', 'eyebrowColor', 'headlineColor', 'sublineColor'] as const;
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

  async remove(id: number) {
    await this.findOneAdmin(id);
    await this.prisma.heroSlide.delete({ where: { id } });
    return { ok: true };
  }

  private validateTranslations(translations: { locale: string }[]): void {
    const locales = translations.map((t) => t.locale);
    const missing = PUBLIC_LOCALES.filter((l) => !locales.includes(l));
    if (missing.length) {
      throw new BadRequestException(
        `Each hero slide must include translations for: ${PUBLIC_LOCALES.join(', ')}. Missing: ${missing.join(', ')}`,
      );
    }
    const dup = locales.filter((l, i) => locales.indexOf(l) !== i);
    if (dup.length) {
      throw new BadRequestException('Duplicate locale in translations');
    }
  }
}
