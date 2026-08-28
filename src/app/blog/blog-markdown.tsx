"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import { toss } from "./toss-tokens";

SyntaxHighlighter.registerLanguage("tsx", tsx);

export function BlogMarkdown({ content }: { content: string }) {
  // extractHeadings()가 훑는 순서와 똑같이 h2/h3를 만날 때마다 증가시켜
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
        a: ({ href, children }) => (
          <a href={href} className="underline" style={{ color: toss.color.primary }}>
            {children}
          </a>
        ),
        code: ({ className, children }) => {
          const match = /language-(\w+)/.exec(className ?? "");
          const isBlock = !!match;
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
          return (
            <SyntaxHighlighter
              language={match[1] === "tsx" || match[1] === "jsx" || match[1] === "ts" ? "tsx" : match[1]}
              style={vscDarkPlus}
              customStyle={{
                margin: "0 0 1.5rem",
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
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
