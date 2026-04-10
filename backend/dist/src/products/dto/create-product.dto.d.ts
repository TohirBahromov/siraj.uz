import { ProductPlacement } from '@prisma/client';
import { ProductTranslationDto } from './product-translation.dto';
export declare class CreateProductDto {
    placement: ProductPlacement;
    categoryIds?: number[];
    badgeColor: string;
    titleColor: string;
    descColor: string;
    btn1Color: string;
    btn1BgColor: string;
    btn2Color: string;
    btn2BgColor: string;
    imgUrl: string;
    backgroundColor: string;
    translations: ProductTranslationDto[];
}
