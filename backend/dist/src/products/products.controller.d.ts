import { ProductPlacement } from '@prisma/client';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findPublic(placement: ProductPlacement, locale?: string): Promise<{
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
}
