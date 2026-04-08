import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path based on your setup
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateContactDto) {
    const formattedPhone = data.phone.replace(/[\s-]/g, '');

    return this.prisma.contactSubmission.create({
      data: {
        name: data.name,
        message: data.message,
        phone: formattedPhone,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 15) {
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

  async markAsRead(id: number) {
    try {
      return await this.prisma.contactSubmission.update({
        where: { id },
        data: { isRead: true },
      });
    } catch (error) {
      throw new NotFoundException(`Xabar topilmadi: ID ${id}`);
    }
  }
}
