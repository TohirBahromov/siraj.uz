import { CategoryTranslationDto } from './category-translation.dto';
export declare class UpdateCategoryDto {
    imgUrl?: string;
    parentId?: number | null;
    translations?: CategoryTranslationDto[];
}
