"use client";

import { useEffect, useState } from "react";
import { transformerNotationDiff } from "@shikijs/transformers";
import { FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeComparisonProps {
  beforeCode: string;
  afterCode: string;
  language: string;
  filename: string;
  highlightColor?: string;
}

export function CodeComparison({
  beforeCode,
  afterCode,
  language,
  filename,
  highlightColor = "rgba(101, 117, 133, 0.16)",
}: CodeComparisonProps) {
  const [highlightedBefore, setHighlightedBefore] = useState("");
  const [highlightedAfter, setHighlightedAfter] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function highlightCode() {
      try {
        const { codeToHtml } = await import("shiki");
        const [before, after] = await Promise.all([
          codeToHtml(beforeCode, {
            lang: language,
            theme: "github-dark-default",
            transformers: [transformerNotationDiff({ matchAlgorithm: "v3" })],
          }),
          codeToHtml(afterCode, {
            lang: language,
            theme: "github-dark-default",
            transformers: [transformerNotationDiff({ matchAlgorithm: "v3" })],
          }),
        ]);
        if (!cancelled) {
          setHighlightedBefore(before);
          setHighlightedAfter(after);
        }
      } catch (err) {
        console.error("code-comparison highlight failed", err);
      }
    }
    highlightCode();
    return () => {
      cancelled = true;
    };
  }, [beforeCode, afterCode, language]);

  const renderCode = (code: string, highlighted: string) => {
    if (highlighted) {
      return (
        <div
          style={{ "--highlight-color": highlightColor } as React.CSSProperties}
          className={cn(
            "h-full w-full overflow-auto bg-neutral-900 font-mono text-xs",
            "[&>pre]:h-full [&>pre]:py-3",
            "[&>pre>code]:inline-block! [&>pre>code]:min-w-full!",
            "[&>pre>code>span]:inline-block! [&>pre>code>span]:min-w-full [&>pre>code>span]:px-4 [&>pre>code>span]:py-0.5",
            "[&>pre>code>.diff.add]:bg-emerald-500/15 [&>pre>code>.diff.remove]:bg-red-500/15",
          )}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    }
    return <pre className="h-full overflow-auto bg-neutral-900 p-4 font-mono text-xs break-all text-neutral-400">{code}</pre>;
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-control)] border border-neutral-200">
      <div className="grid md:grid-cols-2">
        <div className="border-neutral-800 md:border-r">
          <div className="flex items-center border-b border-neutral-800 bg-neutral-800 p-2 text-sm text-neutral-300">
            <FileIcon className="mr-2 h-4 w-4" />
            {filename}
            <span className="ml-auto hidden text-neutral-500 md:block">before</span>
          </div>
          {renderCode(beforeCode, highlightedBefore)}
        </div>
        <div className="border-t border-neutral-800 md:border-t-0">
          <div className="flex items-center border-b border-neutral-800 bg-neutral-800 p-2 text-sm text-neutral-300">
            <FileIcon className="mr-2 h-4 w-4" />
            {filename}
            <span className="ml-auto hidden text-neutral-500 md:block">after</span>
          </div>
          {renderCode(afterCode, highlightedAfter)}
        </div>
      </div>
    </div>
  );
}
