"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
exports.buildSlugId = buildSlugId;
exports.parseSlugId = parseSlugId;
const CYRILLIC_MAP = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
    е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
    й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
    о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch',
    ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
    э: 'e', ю: 'yu', я: 'ya',
    ғ: 'g', қ: 'q', ҳ: 'h', ў: 'o', ҷ: 'j',
    є: 'ye', і: 'i', ї: 'yi', ґ: 'g',
};
function slugify(text) {
    return text
        .toLowerCase()
        .split('')
        .map((char) => CYRILLIC_MAP[char] ?? char)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 100);
}
function buildSlugId(slug, id) {
    return `${slug}-${id}`;
}
function parseSlugId(slugId) {
    const match = slugId.match(/-(\d+)$/);
    if (!match)
        return null;
    const n = parseInt(match[1], 10);
    return isNaN(n) ? null : n;
}
//# sourceMappingURL=slugify.js.map