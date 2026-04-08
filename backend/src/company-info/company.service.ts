import { Injectable } from '@nestjs/common';
import { UpdateCompanyInfoDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async update(dto: UpdateCompanyInfoDto) {
    const ID = 1;

    const data = {
      ...dto,
      latitude: new Prisma.Decimal(dto.latitude ?? 0),
      longitude: new Prisma.Decimal(dto.longitude ?? 0),
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
        latitude: 41.3111, // Tashkent center
        longitude: 69.2797,
      };
    }

    return mapData;
  }
}
