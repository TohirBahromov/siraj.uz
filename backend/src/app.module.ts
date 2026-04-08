import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';
import { HeroSlidesModule } from './hero-slides/hero-slides.module';
import { ContactModule } from './contact/contact.module';
import { CompanyModule } from './company-info/company.module';
import { ProductOrdersModule } from './product-orders/product-orders.module';
import { StaffMembersModule } from './staff-members/staff-members.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    UploadModule,
    HeroSlidesModule,
    ContactModule,
    CompanyModule,
    ProductOrdersModule,
    StaffMembersModule,
  ],
})
export class AppModule {}
