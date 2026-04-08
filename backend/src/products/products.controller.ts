import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
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
    return this.productsService.findPublic(placement, locale?.trim() || 'en');
  }
}
