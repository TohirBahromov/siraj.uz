import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ProductPlacement } from '@prisma/client';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
