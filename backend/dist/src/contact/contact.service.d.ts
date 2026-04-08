import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateContactDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        phone: string;
        message: string;
        isRead: boolean;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        items: {
            id: number;
            createdAt: Date;
            name: string;
            phone: string;
            message: string;
            isRead: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    markAsRead(id: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        phone: string;
        message: string;
        isRead: boolean;
    }>;
}
