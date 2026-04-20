"use client";

import { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/api/admin-api";

// EditorJS is loaded dynamically to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorJSInstance = any;

interface BlockEditorDict {
  saving: string;
  saveBtn: string;
  saved: string;
  loading: string;
  saveFailed: string;
}

interface BlockEditorProps {
  productId: number;
  locale: string;
  initialBlocks: Record<string, unknown>[];
  dict: BlockEditorDict;
}

export function BlockEditor({ productId, locale, initialBlocks, dict }: BlockEditorProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorJSInstance>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    let destroyed = false;

    async function initEditor() {
      const [
        { default: EditorJS },
        { default: Header },
        { default: Paragraph },
        { default: ImageTool },
        { default: Delimiter },
        { default: List },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/paragraph"),
        import("@editorjs/image"),
        import("@editorjs/delimiter"),
        import("@editorjs/list"),
      ]);

      if (destroyed || !holderRef.current) return;

      const editor = new EditorJS({
        holder: holderRef.current,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data:
          initialBlocks.length > 0
            ? ({ blocks: initialBlocks } as any)
            : undefined,
        placeholder: "Start writing your product content…",
        tools: {
          header: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            class: Header as any,
            config: { levels: [1, 2, 3], defaultLevel: 2 },
          },
          paragraph: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            class: Paragraph as any,
            inlineToolbar: true,
          },
          image: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            class: ImageTool as any,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const form = new FormData();
                  form.append("file", file);
                  const res = await adminFetch("/admin/upload?folder=products", {
                    method: "POST",
                    body: form,
                  });
                  if (!res.ok) return { success: 0 };
                  const data = (await res.json()) as { url: string };
                  return { success: 1, file: { url: data.url } };
                },
              },
            },
          },
          delimiter: Delimiter,
          list: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            class: List as any,
            inlineToolbar: true,
          },
        },
        onReady() {
          if (!destroyed) setReady(true);
        },
        onChange() {
          setSaved(false);
        },
      });

      if (destroyed) {
        editor.destroy?.();
        return;
      }

      editorRef.current = editor;
    }

    initEditor();

    return () => {
      destroyed = true;
      if (editorRef.current) {
        editorRef.current.destroy?.();
        editorRef.current = null;
      }
    };
    // initialBlocks intentionally excluded — editor owns state after mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, locale]);

  async function save() {
    if (!editorRef.current) return;
    setSaving(true);
    const data = await editorRef.current.save();
    const res = await adminFetch(
      `/admin/products/${productId}/content/${locale}`,
      { method: "PUT", body: JSON.stringify({ blocks: data.blocks }) },
    );
    setSaving(false);
    if (res.ok) {
      setSaved(true);
    } else {
      alert(dict.saveFailed);
    }
  }

  return (
    <div className="space-y-4">
      {/* EditorJS mount point */}
      <div
        className={`min-h-64 border border-black/10 rounded-2xl bg-white px-2 py-4 transition-opacity duration-200 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <div ref={holderRef} />
      </div>

      {!ready && (
        <p className="text-black/30 text-sm animate-pulse py-4 text-center">
          {dict.loading}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && <span className="text-sm text-green-600">{dict.saved}</span>}
        <button
          type="button"
          onClick={save}
          disabled={saving || !ready}
          className="rounded-full bg-[#1d1d1f] text-white text-sm px-6 py-2.5 font-medium hover:bg-black/85 disabled:opacity-60 cursor-pointer transition-colors"
        >
          {saving ? dict.saving : dict.saveBtn}
        </button>
      </div>
    </div>
  );
}
