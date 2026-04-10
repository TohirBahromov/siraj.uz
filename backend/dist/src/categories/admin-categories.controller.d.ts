import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class AdminCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
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
    findOne(id: number): Promise<{
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
}
