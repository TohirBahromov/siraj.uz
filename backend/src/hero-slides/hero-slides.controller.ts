import { Controller, Get, Query } from '@nestjs/common';
import { HeroSlidesService } from './hero-slides.service';

@Controller('hero-slides')
export class HeroSlidesController {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  @Get()
  findPublic(@Query('lang') lang: string) {
    return this.heroSlidesService.findPublic(lang || 'en');
  }
}
