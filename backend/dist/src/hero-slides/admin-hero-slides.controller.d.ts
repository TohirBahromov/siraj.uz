import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';
export declare class AdminHeroSlidesController {
    private readonly heroSlidesService;
    constructor(heroSlidesService: HeroSlidesService);
    findAll(): Promise<({
        translations: {
            locale: string;
            id: number;
            eyebrow: string;
            headline: string;
            subline: string;
            heroSlideId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        videoSrc: string;
        eyebrowColor: string;
        headlineColor: string;
        sublineColor: string;
    })[]>;
    findOne(id: string): Promise<{
        translations: {
            locale: string;
            id: number;
            eyebrow: string;
            headline: string;
            subline: string;
            heroSlideId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        videoSrc: string;
        eyebrowColor: string;
        headlineColor: string;
        sublineColor: string;
    }>;
    create(dto: CreateHeroSlideDto): Promise<{
        translations: {
            locale: string;
            id: number;
            eyebrow: string;
            headline: string;
            subline: string;
            heroSlideId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        videoSrc: string;
        eyebrowColor: string;
        headlineColor: string;
        sublineColor: string;
    }>;
    update(id: string, dto: UpdateHeroSlideDto): Promise<{
        translations: {
            locale: string;
            id: number;
            eyebrow: string;
            headline: string;
            subline: string;
            heroSlideId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        videoSrc: string;
        eyebrowColor: string;
        headlineColor: string;
        sublineColor: string;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
