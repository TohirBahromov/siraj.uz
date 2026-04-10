import { CategoriesService } from './categories.service';
export declare class PublicCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findTree(locale?: string, leafOnly?: string): Promise<import("./categories.service").PublicCategoryNode[]>;
    getProducts(slug: string, locale?: string, cursor?: string, limit?: string): Promise<{
        products: {
            id: number;
            slug: string | null;
            title: string;
            badge: string | null;
            imgUrl: string;
            badgeColor: string;
            titleColor: string;
            backgroundColor: string;
            descColor: string;
            desc: string;
            btn1Color: string;
            btn1BgColor: string;
            btn2Color: string;
            btn2BgColor: string;
            placement: import("@prisma/client").$Enums.ProductPlacement;
        }[];
        nextCursor: number | null;
    }>;
    findBySlug(slug: string, locale?: string): Promise<{
        id: number;
        slug: string;
        name: string;
        imgUrl: string;
        children: {
            id: number;
            slug: string;
            name: string;
            imgUrl: string;
        }[];
        products: {
            id: number;
            slug: string | null;
            title: string;
            badge: string | null;
            imgUrl: string;
            badgeColor: string;
            titleColor: string;
        }[];
    }>;
}
