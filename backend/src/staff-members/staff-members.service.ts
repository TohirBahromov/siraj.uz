import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';

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
  translations: { locale: string; name: string; position: string }[],
  locale: PublicLocale,
) {
  return (
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === 'en') ??
    translations[0]
  );
}

@Injectable()
export class StaffMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(locale: string) {
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
    console.log({
      items,
      meta: {
        total,
        page,
        lastPage: Math.max(1, Math.ceil(total / limit)),
      },
    });
    return {
      items,
      meta: {
        total,
        page,
        lastPage: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOneAdmin(id: number) {
    const member = await this.prisma.staffMember.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!member) throw new NotFoundException('Staff member not found');
    return member;
  }

  async create(dto: CreateStaffMemberDto) {
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

  async update(id: number, dto: UpdateStaffMemberDto) {
    await this.findOneAdmin(id);
    const { translations, ...rest } = dto;
    const data: Record<string, unknown> = {};
    if (rest.imageUrl !== undefined) data.imageUrl = rest.imageUrl;
    if (rest.order !== undefined) data.order = rest.order;
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

  async remove(id: number) {
    await this.findOneAdmin(id);
    await this.prisma.staffMember.delete({ where: { id } });
    return { ok: true };
  }
}
