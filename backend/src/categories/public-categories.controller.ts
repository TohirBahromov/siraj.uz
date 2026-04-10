import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class PublicCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findTree(
    @Query('locale') locale?: string,
    @Query('leafOnly') leafOnly?: string,
  ) {
    return this.categoriesService.findTree(
      locale?.trim() || 'uz',
      leafOnly === 'true',
    );
  }

  @Get(':slug/products')
  getProducts(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.categoriesService.findProductsBySlug(
      slug,
      locale?.trim() || 'uz',
      cursor ? Number(cursor) : undefined,
      limit ? Math.min(Number(limit), 50) : 10,
    );
  }

  @Get(':slug')
  findBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.categoriesService.findBySlug(slug, locale?.trim() || 'uz');
  }
}
