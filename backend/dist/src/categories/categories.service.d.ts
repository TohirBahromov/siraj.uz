import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export type PublicCategoryNode = {
    id: number;
    slug: string;
    name: string;
    imgUrl: string;
    children: PublicCategoryNode[];
};
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllAdmin(): Promise<({
        translations: {
            locale: string;
            id: number;
            slug: string;
            name: string;
            categoryId: number;
        }[];
        children: ({
            translations: {
                locale: string;
                id: number;
                slug: string;
                name: string;
                categoryId: number;
            }[];
        } & {
            imgUrl: string;
            id: number;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            parentId: number | null;
            level: number;
        })[];
    } & {
        imgUrl: string;
        id: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        level: number;
    })[]>;
    findOneAdmin(id: number): Promise<{
        translations: {
            locale: string;
            id: number;
            slug: string;
            name: string;
            categoryId: number;
        }[];
    } & {
        imgUrl: string;
        id: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        level: number;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        translations: {
            locale: string;
            id: number;
            slug: string;
            name: string;
            categoryId: number;
        }[];
    } & {
        imgUrl: string;
        id: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        level: number;
    }>;
    update(id: number, dto: UpdateCategoryDto): Promise<{
        translations: {
            locale: string;
            id: number;
            slug: string;
            name: string;
            categoryId: number;
        }[];
    } & {
        imgUrl: string;
        id: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: number | null;
        level: number;
    }>;
    remove(id: number): Promise<{
        ok: boolean;
    }>;
    findTree(locale: string, leafOnly?: boolean): Promise<PublicCategoryNode[]>;
    findProductsBySlug(slug: string, locale: string, cursor: number | undefined, limit: number): Promise<{
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
            categories: number[];
        }[];
        nextCursor: number | null;
    }>;
    findBySlug(slug: string, locale: string): Promise<{
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
    private findByLocaleSlug;
    private computeLevel;
    private uniqueSlug;
    private validateTranslations;
}
