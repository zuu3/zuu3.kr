"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

SyntaxHighlighter.registerLanguage("tsx", tsx);

export function CodeBlock({
  code,
  highlight,
  accentColor,
}: {
  code: string;
  highlight?: string;
  accentColor: string;
}) {
  const lines = code.split("\n");
  return (
    <SyntaxHighlighter
      language="tsx"
      style={vscDarkPlus}
      wrapLines
      showLineNumbers
      lineNumberContainerStyle={{ display: "none" }}
      lineNumberStyle={{ display: "none" }}
      lineProps={(lineNumber: number) => {
        const isHighlighted = !!highlight && !!lines[lineNumber - 1]?.includes(highlight);
        return {
          style: {
            display: "block",
            ...(isHighlighted
              ? {
                  background: `${accentColor}22`,
                  borderLeft: `2px solid ${accentColor}`,
                  marginLeft: "-1.25rem",
                  paddingLeft: "calc(1.25rem - 2px)",
                }
              : {}),
          },
        };
      }}
      customStyle={{
        margin: 0,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflowX: "auto",
        borderRadius: "var(--radius-control)",
        fontSize: "0.8rem",
        padding: "1.25rem",
        lineHeight: 1.6,
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

const MOCK_SUPERVISORS = ["김민준", "이서연", "박도윤", "최지우", "정하은", "강시우", "윤서준", "임하윤"];

function DebounceSearchDemo({ accentColor }: { accentColor: string }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(MOCK_SUPERVISORS);
  const [keystrokes, setKeystrokes] = useState(0);
  const [requests, setRequests] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (keystrokes === 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFiltered(MOCK_SUPERVISORS.filter((name) => name.includes(query)));
      setRequests((r) => r + 1);
    }, 400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="w-full rounded-[var(--radius-control)] border border-neutral-200 bg-[#fafafa] p-5">
      <p className="text-xs font-bold tracking-wide text-neutral-500 uppercase">직접 입력해보세요</p>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setKeystrokes((k) => k + 1);
        }}
        placeholder="감독 이름 검색..."
        className="mt-2 w-full rounded-[var(--radius-control)] border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
      />
      <p className="mt-3 text-sm text-neutral-500">
        타이핑 <span className="font-bold text-neutral-900">{keystrokes}</span>회{" → "}
        실제 요청 <span className="font-bold" style={{ color: accentColor }}>{requests}</span>회
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {filtered.map((name) => (
          <span
            key={name}
            className="rounded-[var(--radius-control)] bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-sm"
          >
            {name}
          </span>
        ))}
        {filtered.length === 0 && (
          <span className="text-xs text-neutral-500">일치하는 감독이 없습니다</span>
        )}
      </div>
    </div>
  );
}

const PROJECT_DEMOS: Record<string, ComponentType<{ accentColor: string }>> = {
  teachmon: DebounceSearchDemo,
};

export function ProjectDemo({ slug, accentColor }: { slug: string; accentColor: string }) {
  const Demo = PROJECT_DEMOS[slug];
  if (!Demo) return null;
  return <Demo accentColor={accentColor} />;
}

export function hasProjectDemo(slug: string): boolean {
  return slug in PROJECT_DEMOS;
}
