import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { ProductOrdersService } from './product-orders.service';
import { CreateProductOrderDto } from './dto/create-product-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('product-orders')
export class ProductOrdersController {
  constructor(private readonly service: ProductOrdersService) {}

  /** Public: submit a buy request */
  @Post()
  create(@Body() dto: CreateProductOrderDto) {
    return this.service.create(dto);
  }

  /** Admin: list all orders */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.service.findAll(page, limit);
  }
}
