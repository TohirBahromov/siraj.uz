import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
export declare class AdminProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<({
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
    findOne(id: number): Promise<{
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
}
