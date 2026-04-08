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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminHeroSlidesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const hero_slides_service_1 = require("./hero-slides.service");
const create_hero_slide_dto_1 = require("./dto/create-hero-slide.dto");
const update_hero_slide_dto_1 = require("./dto/update-hero-slide.dto");
let AdminHeroSlidesController = class AdminHeroSlidesController {
    heroSlidesService;
    constructor(heroSlidesService) {
        this.heroSlidesService = heroSlidesService;
    }
    findAll() {
        return this.heroSlidesService.findAllAdmin();
    }
    findOne(id) {
        return this.heroSlidesService.findOneAdmin(+id);
    }
    create(dto) {
        return this.heroSlidesService.create(dto);
    }
    update(id, dto) {
        return this.heroSlidesService.update(+id, dto);
    }
    remove(id) {
        return this.heroSlidesService.remove(+id);
    }
};
exports.AdminHeroSlidesController = AdminHeroSlidesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminHeroSlidesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminHeroSlidesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hero_slide_dto_1.CreateHeroSlideDto]),
    __metadata("design:returntype", void 0)
], AdminHeroSlidesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hero_slide_dto_1.UpdateHeroSlideDto]),
    __metadata("design:returntype", void 0)
], AdminHeroSlidesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminHeroSlidesController.prototype, "remove", null);
exports.AdminHeroSlidesController = AdminHeroSlidesController = __decorate([
    (0, common_1.Controller)('admin/hero-slides'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [hero_slides_service_1.HeroSlidesService])
], AdminHeroSlidesController);
//# sourceMappingURL=admin-hero-slides.controller.js.map