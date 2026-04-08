import { PrismaService } from '../prisma/prisma.service';
import { CreateProductOrderDto } from './dto/create-product-order.dto';
export declare class ProductOrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductOrderDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        productId: number;
        phone: string;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        items: {
            id: number;
            name: string;
            phone: string;
            createdAt: Date;
            productId: number;
            productName: string;
        }[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
}
