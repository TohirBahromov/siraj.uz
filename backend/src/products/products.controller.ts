import { Controller, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { ProductPlacement } from '@prisma/client';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findPublic(
    @Query('placement', new ParseEnumPipe(ProductPlacement))
    placement: ProductPlacement,
    @Query('locale') locale?: string,
  ) {
    return this.productsService.findPublic(placement, locale?.trim() || 'uz');
  }

  @Get(':slugId')
  findOne(
    @Param('slugId') slugId: string,
    @Query('locale') locale?: string,
  ) {
    return this.productsService.findPublicBySlugId(slugId, locale?.trim() || 'uz');
  }

  @Get(':slugId/content')
  getContent(
    @Param('slugId') slugId: string,
    @Query('locale') locale?: string,
  ) {
    return this.productsService.getPublicContent(slugId, locale?.trim() || 'uz');
  }
}
