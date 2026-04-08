import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';

@Controller('admin/hero-slides')
@UseGuards(JwtAuthGuard)
export class AdminHeroSlidesController {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  @Get()
  findAll() {
    return this.heroSlidesService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.heroSlidesService.findOneAdmin(+id);
  }

  @Post()
  create(@Body() dto: CreateHeroSlideDto) {
    return this.heroSlidesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto) {
    return this.heroSlidesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroSlidesService.remove(+id);
  }
}
