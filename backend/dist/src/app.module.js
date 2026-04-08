"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const products_module_1 = require("./products/products.module");
const upload_module_1 = require("./upload/upload.module");
const hero_slides_module_1 = require("./hero-slides/hero-slides.module");
const contact_module_1 = require("./contact/contact.module");
const company_module_1 = require("./company-info/company.module");
const product_orders_module_1 = require("./product-orders/product-orders.module");
const staff_members_module_1 = require("./staff-members/staff-members.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            upload_module_1.UploadModule,
            hero_slides_module_1.HeroSlidesModule,
            contact_module_1.ContactModule,
            company_module_1.CompanyModule,
            product_orders_module_1.ProductOrdersModule,
            staff_members_module_1.StaffMembersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map