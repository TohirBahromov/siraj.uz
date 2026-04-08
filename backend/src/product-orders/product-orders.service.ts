import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductOrderDto } from './dto/create-product-order.dto';

@Injectable()
export class ProductOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductOrderDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.productOrder.create({
      data: {
        productId: dto.productId,
        name: dto.name.trim(),
        phone: dto.phone.replace(/[\s-]/g, ''),
      },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.productOrder.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: { translations: { where: { locale: 'en' } } },
          },
        },
      }),
      this.prisma.productOrder.count(),
    ]);

    return {
      items: items.map((o) => ({
        id: o.id,
        name: o.name,
        phone: o.phone,
        createdAt: o.createdAt,
        productId: o.productId,
        productName: o.product.translations[0]?.title ?? `Product #${o.productId}`,
      })),
      meta: {
        total,
        page,
        lastPage: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }
}
