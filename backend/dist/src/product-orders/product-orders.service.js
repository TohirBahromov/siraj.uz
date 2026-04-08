"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductOrdersService = class ProductOrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.prisma.productOrder.create({
            data: {
                productId: dto.productId,
                name: dto.name.trim(),
                phone: dto.phone.replace(/[\s-]/g, ''),
            },
        });
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.productOrder.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    product: {
                        include: { translations: { where: { locale: 'en' } } },
                    },
                },
            }),
            this.prisma.productOrder.count(),
        ]);
        return {
            items: items.map((o) => ({
                id: o.id,
                name: o.name,
                phone: o.phone,
                createdAt: o.createdAt,
                productId: o.productId,
                productName: o.product.translations[0]?.title ?? `Product #${o.productId}`,
            })),
            meta: {
                total,
                page,
                lastPage: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
};
exports.ProductOrdersService = ProductOrdersService;
exports.ProductOrdersService = ProductOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductOrdersService);
//# sourceMappingURL=product-orders.service.js.map