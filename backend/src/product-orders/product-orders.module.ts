import { Module } from '@nestjs/common';
import { ProductOrdersService } from './product-orders.service';
import { ProductOrdersController } from './product-orders.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductOrdersController],
  providers: [ProductOrdersService],
})
export class ProductOrdersModule {}
