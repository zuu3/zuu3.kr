"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import { toss } from "./toss-tokens";

// 지금까지 쓴 글은 전부 tsx뿐이었지만, 펜스 언어 태그가 이거 하나만
// 등록돼 있으면 bash/json/sql 등은 그냥 색 없는 텍스트로 나간다 - 다음
// 글에서 다른 언어를 쓸 걸 대비해 자주 쓰는 언어를 미리 등록해둔다.
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("markdown", markdown);

// 펜스 언어 태그(````js`, ```sh`, ```yml` 등 흔한 축약형)를 등록된
// 이름으로 정규화한다.
const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
};
const REGISTERED_LANGUAGES = new Set([
  "tsx",
  "jsx",
  "typescript",
  "javascript",
  "bash",
  "json",
  "css",
  "python",
  "sql",
  "yaml",
  "markdown",
]);
function resolveLanguage(tag: string | undefined): string | undefined {
  if (!tag) return undefined;
  const normalized = LANGUAGE_ALIASES[tag] ?? tag;
  return REGISTERED_LANGUAGES.has(normalized) ? normalized : undefined;
}

// 코드 블록은 항상 다크 하이라이터 스타일(vscDarkPlus)이라 - 블로그
// 다크모드와 무관하게 버튼은 늘 어두운 배경 위에 놓인다는 전제로 고정 색.
function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      aria-label="코드 복사"
      className="absolute top-3 right-3 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-neutral-300 opacity-0 transition group-hover/code:opacity-100 hover:bg-white/10"
      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

export function BlogMarkdown({ content }: { content: string }) {
  // extractHeadings()가 훑는 순서와 똑같이 h2/h3/h4를 만날 때마다 증가시켜
  // 같은 heading-N id를 붙인다 (src/lib/toc.ts 참고).
  let headingIndex = 0;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2
            id={`heading-${headingIndex++}`}
            className="mt-10 mb-3 scroll-mt-24 font-bold tracking-tight first:mt-0"
            style={{ color: toss.color.foreground, fontSize: 24, lineHeight: "1.4" }}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            id={`heading-${headingIndex++}`}
            className="mt-8 mb-2 scroll-mt-24 font-bold tracking-tight"
            style={{ color: toss.color.foreground, fontSize: 18, lineHeight: "1.4" }}
          >
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4
            id={`heading-${headingIndex++}`}
            className="mt-6 mb-2 scroll-mt-24 font-bold tracking-tight"
            style={{ color: toss.color.foreground, fontSize: 16, lineHeight: "1.4" }}
          >
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="mb-4" style={{ color: toss.color.body, fontSize: 16, lineHeight: "24px" }}>
            {children}
          </p>
        ),
        ul: ({ children }) => <ul className="mb-4 list-disc space-y-1.5 pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1.5 pl-5">{children}</ol>,
        li: ({ children }) => (
          <li style={{ color: toss.color.body, fontSize: 16, lineHeight: "24px" }}>{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-bold" style={{ color: toss.color.foreground }}>
            {children}
          </strong>
        ),
        hr: () => <hr className="my-10" style={{ borderColor: toss.color.border }} />,
        // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage에
        // 올라간 임의 크기 이미지라 width/height를 미리 알 수 없다. next/image로
        // 바꾸려면 업로드 시점에 실제 치수를 재서 저장해둬야 하는데, 지금 에디터
        // 업로드 흐름엔 그 단계가 없다. lazy 로딩만이라도 걸어 초기 로드 비용을 줄인다.
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="my-6 w-full rounded-md"
            style={{ border: `1px solid ${toss.color.border}` }}
          />
        ),
        table: ({ children }) => (
          <div className="mb-4 overflow-x-auto rounded-md" style={{ border: `1px solid ${toss.color.border}` }}>
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead style={{ backgroundColor: toss.color.surface }}>{children}</thead>,
        th: ({ children }) => (
          <th
            className="px-4 py-2.5 text-left font-bold whitespace-nowrap"
            style={{ color: toss.color.foreground, borderBottom: `1px solid ${toss.color.border}` }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2.5" style={{ color: toss.color.body, borderTop: `1px solid ${toss.color.border}` }}>
            {children}
          </td>
        ),
        a: ({ href, children }) => (
          <a href={href} className="underline" style={{ color: toss.color.primary }}>
            {children}
          </a>
        ),
        code: ({ className, children }) => {
          const match = /language-(\w+)/.exec(className ?? "");
          // 언어 태그가 없는 펜스 블록(```text)도 fenced code라 여러 줄인 경우가
          // 있다 — className만으로는 인라인/블록을 구분할 수 없어서 줄바꿈 여부도 본다.
          const isBlock = !!match || String(children).includes("\n");
          if (!isBlock) {
            return (
              <code
                className="rounded px-1.5 py-0.5 text-[0.9em]"
                style={{ backgroundColor: toss.color.surface, color: toss.color.foreground }}
              >
                {children}
              </code>
            );
          }
          const code = String(children).replace(/\n$/, "");
          return (
            <div className="group/code relative mb-6">
              <SyntaxHighlighter
                language={resolveLanguage(match?.[1])}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  overflowX: "auto",
                  borderRadius: toss.radius.md,
                  fontSize: "0.85rem",
                  padding: "1.25rem",
                  lineHeight: 1.6,
                }}
              >
                {code}
              </SyntaxHighlighter>
              <CopyCodeButton code={code} />
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
