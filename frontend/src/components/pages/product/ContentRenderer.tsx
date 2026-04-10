import { Container } from "@/components/ui/Container";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";

type EJBlock = {
  id?: string;
  type: string;
  data: Record<string, unknown>;
};

interface Props {
  blocks: EJBlock[] | Record<string, unknown>[];
}

const ALLOWED_INLINE: sanitizeHtml.IOptions = {
  allowedTags: ["b", "i", "em", "strong", "u", "s", "code", "mark", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
};

function clean(html: string): string {
  return sanitizeHtml(html, ALLOWED_INLINE);
}

// EditorJS List v2 items are objects; v1 items are plain strings
function getItemText(item: unknown): string {
  if (typeof item === "string") return item;
  if (item && typeof item === "object" && "content" in item) {
    return (item as { content: string }).content;
  }
  return "";
}

export function ContentRenderer({ blocks }: Props) {
  if (!blocks.length) return null;

  return (
    <Container className="space-y-8 px-4 sm:px-0 pb-20">
      {(blocks as EJBlock[]).map((block, i) => {
        const key = block.id ?? String(i);

        switch (block.type) {
          case "header": {
            const level = (block.data.level as number) ?? 2;
            const text = clean((block.data.text as string) ?? "");
            const Tag = `h${Math.min(Math.max(level, 1), 6)}` as
              | "h1"
              | "h2"
              | "h3"
              | "h4"
              | "h5"
              | "h6";
            const sizeClass =
              level === 1 ? "text-4xl" : level === 2 ? "text-3xl" : "text-2xl";
            return (
              <Tag
                key={key}
                className={`${sizeClass} font-semibold tracking-tight text-[#1d1d1f] mb-5`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            );
          }

          case "paragraph":
            return (
              <p
                key={key}
                className="text-base leading-relaxed text-[#1d1d1f]/80 mb-5"
                dangerouslySetInnerHTML={{
                  __html: clean((block.data.text as string) ?? ""),
                }}
              />
            );

          case "image": {
            const file = block.data.file as { url: string } | undefined;
            const url = (file?.url ?? block.data.url) as string | undefined;
            if (!url) return null;
            const caption = block.data.caption as string | undefined;
            return (
              <figure key={key} className="space-y-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/5">
                  <Image
                    src={url}
                    alt={caption ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
                {caption && (
                  <figcaption className="text-sm text-center text-black/40">
                    {caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          case "delimiter":
            return <hr key={key} className="border-black/10" />;

          case "list": {
            const rawItems = (block.data.items as unknown[]) ?? [];
            const items = rawItems.map(getItemText);
            if (block.data.style === "ordered") {
              return (
                <ol
                  key={key}
                  className="list-decimal list-inside text-base text-[#1d1d1f]/80 mb-5"
                >
                  {items.map((item, idx) => (
                    <li
                      key={idx}
                      dangerouslySetInnerHTML={{ __html: clean(item) }}
                    />
                  ))}
                </ol>
              );
            }
            return (
              <ul
                key={key}
                className="list-disc list-inside text-base text-[#1d1d1f]/80 mb-5"
              >
                {items.map((item, idx) => (
                  <li
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: clean(item) }}
                  />
                ))}
              </ul>
            );
          }

          default:
            return null;
        }
      })}
    </Container>
  );
}
