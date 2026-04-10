const CYRILLIC_MAP: Record<string, string> = {
  // Russian/Ukrainian
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd',
  е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
  // Uzbek-specific
  ғ: 'g', қ: 'q', ҳ: 'h', ў: 'o', ҷ: 'j',
  // Ukrainian extras
  є: 'ye', і: 'i', ї: 'yi', ґ: 'g',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

/** Produces a URL-safe slug from a name + unique id, e.g. "iphone-15-pro-42" */
export function buildSlugId(slug: string, id: number): string {
  return `${slug}-${id}`;
}

/** Parses the numeric id appended to a slug, e.g. "iphone-15-pro-42" → 42 */
export function parseSlugId(slugId: string): number | null {
  const match = slugId.match(/-(\d+)$/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  return isNaN(n) ? null : n;
}
