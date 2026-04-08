import { ProductPlacement } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findPublic(placement: ProductPlacement, locale: string): Promise<{
        id: number;
        badge: string | null;
        badgeColor: string;
        title: string;
        titleColor: string;
        desc: string;
        descColor: string;
        btn1Color: string;
        btn1BgColor: string;
        btn2Color: string;
        btn2BgColor: string;
        imgUrl: string;
        backgroundColor: string;
        placement: import("@prisma/client").$Enums.ProductPlacement;
    }[]>;
    findAllAdmin(): Promise<({
        translations: {
            locale: string;
            badge: string | null;
            title: string;
            desc: string;
            id: number;
            productId: number;
        }[];
    } & {
        placement: import("@prisma/client").$Enums.ProductPlacement;
        badgeColor: string;
        titleColor: string;
        descColor: string;
        btn1Color: string;
        btn1BgColor: string;
        btn2Color: string;
        btn2BgColor: string;
        imgUrl: string;
        backgroundColor: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOneAdmin(id: number): Promise<{
        translations: {
            locale: string;
            badge: string | null;
            title: string;
            desc: string;
            id: number;
            productId: number;
        }[];
    } & {
        placement: import("@prisma/client").$Enums.ProductPlacement;
        badgeColor: string;
        titleColor: string;
        descColor: string;
        btn1Color: string;
        btn1BgColor: string;
        btn2Color: string;
        btn2BgColor: string;
        imgUrl: string;
        backgroundColor: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateProductDto): Promise<{
        translations: {
            locale: string;
            badge: string | null;
            title: string;
            desc: string;
            id: number;
            productId: number;
        }[];
    } & {
        placement: import("@prisma/client").$Enums.ProductPlacement;
        badgeColor: string;
        titleColor: string;
        descColor: string;
        btn1Color: string;
        btn1BgColor: string;
        btn2Color: string;
        btn2BgColor: string;
        imgUrl: string;
        backgroundColor: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        translations: {
            locale: string;
            badge: string | null;
            title: string;
            desc: string;
            id: number;
            productId: number;
        }[];
    } & {
        placement: import("@prisma/client").$Enums.ProductPlacement;
        badgeColor: string;
        titleColor: string;
        descColor: string;
        btn1Color: string;
        btn1BgColor: string;
        btn2Color: string;
        btn2BgColor: string;
        imgUrl: string;
        backgroundColor: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        ok: boolean;
    }>;
    private validateTranslations;
}
