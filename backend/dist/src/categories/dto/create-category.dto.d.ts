import { CategoryTranslationDto } from './category-translation.dto';
export declare class CreateCategoryDto {
    imgUrl: string;
    parentId?: number | null;
    translations: CategoryTranslationDto[];
}
