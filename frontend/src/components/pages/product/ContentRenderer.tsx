import Image from "next/image";

// EditorJS block format
type EJBlock = {
  id?: string;
  type: string;
  data: Record<string, unknown>;
};

interface Props {
  // accepts either EditorJS blocks or our legacy custom blocks
  blocks: EJBlock[] | Record<string, unknown>[];
}

export function ContentRenderer({ blocks }: Props) {
  if (!blocks.length) return null;

  return (
    <div className="max-w-3xl mx-auto mt-20 space-y-8 px-4 sm:px-0 pb-20">
      {(blocks as EJBlock[]).map((block, i) => {
        const key = block.id ?? String(i);

        switch (block.type) {
          // ── EditorJS: header ─────────────────────────────────────
          case "header": {
            const level = (block.data.level as number) ?? 2;
            const text = block.data.text as string;
            const Tag = `h${level}` as "h1" | "h2" | "h3";
            const sizeClass =
              level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : "text-xl";
            return (
              <Tag
                key={key}
                className={`${sizeClass} font-semibold tracking-tight text-[#1d1d1f]`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            );
          }

          // ── EditorJS: paragraph ──────────────────────────────────
          case "paragraph":
            return (
              <p
                key={key}
                className="text-base leading-relaxed text-[#1d1d1f]/80"
                dangerouslySetInnerHTML={{
                  __html: block.data.text as string,
                }}
              />
            );

          // ── EditorJS: image ──────────────────────────────────────
          case "image": {
            const file = block.data.file as { url: string } | undefined;
            const url = (file?.url ?? block.data.url) as string | undefined;
            if (!url) return null;
            return (
              <figure key={key} className="space-y-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/5">
                  <Image
                    src={url}
                    alt={(block.data.caption as string) ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
                {block.data.caption && (
                  <figcaption className="text-sm text-center text-black/40">
                    {block.data.caption as string}
                  </figcaption>
                )}
              </figure>
            );
          }

          // ── EditorJS: delimiter ──────────────────────────────────
          case "delimiter":
            return <hr key={key} className="border-black/10" />;

          // ── EditorJS: list ───────────────────────────────────────
          case "list": {
            const items = (block.data.items as string[]) ?? [];
            if (block.data.style === "ordered") {
              return (
                <ol
                  key={key}
                  className="list-decimal list-inside space-y-1 text-base text-[#1d1d1f]/80"
                >
                  {items.map((item, idx) => (
                    <li
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  ))}
                </ol>
              );
            }
            return (
              <ul
                key={key}
                className="list-disc list-inside space-y-1 text-base text-[#1d1d1f]/80"
              >
                {items.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );
          }

          // ── Legacy custom blocks (backwards compat) ──────────────
          case "heading": {
            const level = (block.data.level as number) ?? (block as unknown as {level:number}).level ?? 2;
            const text = (block.data.text as string) ?? (block as unknown as {text:string}).text ?? "";
            const Tag = `h${level}` as "h1" | "h2" | "h3";
            const sizeClass =
              level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : "text-xl";
            return (
              <Tag
                key={key}
                className={`${sizeClass} font-semibold tracking-tight text-[#1d1d1f]`}
              >
                {text}
              </Tag>
            );
          }

          case "divider":
            return <hr key={key} className="border-black/10" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
