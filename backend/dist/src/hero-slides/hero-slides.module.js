"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroSlidesModule = void 0;
const common_1 = require("@nestjs/common");
const hero_slides_service_1 = require("./hero-slides.service");
const hero_slides_controller_1 = require("./hero-slides.controller");
const admin_hero_slides_controller_1 = require("./admin-hero-slides.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let HeroSlidesModule = class HeroSlidesModule {
};
exports.HeroSlidesModule = HeroSlidesModule;
exports.HeroSlidesModule = HeroSlidesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [hero_slides_controller_1.HeroSlidesController, admin_hero_slides_controller_1.AdminHeroSlidesController],
        providers: [hero_slides_service_1.HeroSlidesService],
    })
], HeroSlidesModule);
//# sourceMappingURL=hero-slides.module.js.map