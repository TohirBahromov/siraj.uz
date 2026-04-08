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
exports.UpdateStaffMemberDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const staff_member_translation_dto_1 = require("./staff-member-translation.dto");
class UpdateStaffMemberDto {
    imageUrl;
    order;
    translations;
}
exports.UpdateStaffMemberDto = UpdateStaffMemberDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStaffMemberDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateStaffMemberDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => staff_member_translation_dto_1.StaffMemberTranslationDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStaffMemberDto.prototype, "translations", void 0);
//# sourceMappingURL=update-staff-member.dto.js.map