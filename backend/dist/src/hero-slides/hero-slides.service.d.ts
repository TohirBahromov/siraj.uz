import { PrismaService } from '../prisma/prisma.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';
export declare class HeroSlidesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findPublic(locale: string): Promise<{
        id: number;
        videoSrc: string;
        eyebrowColor: string;
        headlineColor: string;
        sublineColor: string;
        eyebrow: string;
        headline: string;
        subline: string;
    }[]>;
    findAllAdmin(): Promise<({
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
    findOneAdmin(id: number): Promise<{
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
    update(id: number, dto: UpdateHeroSlideDto): Promise<{
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
    remove(id: number): Promise<{
        ok: boolean;
    }>;
    private validateTranslations;
}
