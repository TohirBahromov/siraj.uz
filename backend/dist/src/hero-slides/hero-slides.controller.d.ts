import { HeroSlidesService } from './hero-slides.service';
export declare class HeroSlidesController {
    private readonly heroSlidesService;
    constructor(heroSlidesService: HeroSlidesService);
    findPublic(lang: string): Promise<{
        id: number;
        videoSrc: string;
        eyebrowColor: string;
        headlineColor: string;
        sublineColor: string;
        eyebrow: string;
        headline: string;
        subline: string;
    }[]>;
}
