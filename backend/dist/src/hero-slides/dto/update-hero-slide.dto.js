"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHeroSlideDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_hero_slide_dto_1 = require("./create-hero-slide.dto");
class UpdateHeroSlideDto extends (0, mapped_types_1.PartialType)(create_hero_slide_dto_1.CreateHeroSlideDto) {
}
exports.UpdateHeroSlideDto = UpdateHeroSlideDto;
//# sourceMappingURL=update-hero-slide.dto.js.map