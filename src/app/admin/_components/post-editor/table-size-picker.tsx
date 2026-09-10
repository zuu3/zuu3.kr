"use client";

import { useState } from "react";
import { toss } from "@/app/blog/toss-tokens";

const TABLE_PICKER_MAX = 6;

// Notion/구글 문서처럼 격자에서 칸 수를 마우스로 훑어 고르는 표 삽입 UI.
// 행/열 개수를 숫자로 입력하게 하는 것보다 훨씬 빠르고, 결과 크기를 바로
// 눈으로 보면서 고를 수 있다.
export function TableSizePicker({
  onPick,
  onClose,
}: {
  onPick: (rows: number, cols: number) => void;
  onClose: () => void;
}) {
  const [hover, setHover] = useState({ rows: 2, cols: 2 });

  return (
    <div className="absolute top-full left-0 z-10 mt-1 rounded-md border border-neutral-200 bg-white p-3 shadow-lg">
      <p className="mb-2 text-xs text-neutral-400">
        {hover.rows} x {hover.cols} 표
      </p>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${TABLE_PICKER_MAX}, 1fr)` }}
        onMouseLeave={() => setHover({ rows: 2, cols: 2 })}
      >
        {Array.from({ length: TABLE_PICKER_MAX * TABLE_PICKER_MAX }, (_, i) => {
          const row = Math.floor(i / TABLE_PICKER_MAX) + 1;
          const col = (i % TABLE_PICKER_MAX) + 1;
          const active = row <= hover.rows && col <= hover.cols;
          return (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHover({ rows: row, cols: col })}
              onClick={() => {
                onPick(row, col);
                onClose();
              }}
              className={`h-4 w-4 rounded-sm border ${
                active ? "border-transparent" : "border-neutral-200 bg-neutral-50"
              }`}
              style={active ? { backgroundColor: toss.color.primary } : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
