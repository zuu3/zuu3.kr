"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TriangleAlert } from "lucide-react";
import { toss } from "@/app/blog/toss-tokens";

// 브라우저 기본 confirm()은 에디터 화면 전체와 스타일이 안 맞는다. 삭제,
// 저장 안 하고 나가기처럼 "확인이 필요한 위험한 동작"이 이 훅 하나로
// 재사용된다 - 모달 상태와 모달 자체를 한 파일에 묶어서, 쓰는 쪽에서는
// ask()만 호출하고 <ConfirmDialog />만 렌더링하면 되게 했다.
export function useConfirmDialog() {
  const [state, setState] = useState<{ message: string; onConfirm: () => void } | null>(null);

  function ask(message: string, onConfirm: () => void) {
    setState({ message, onConfirm });
  }

  function cancel() {
    setState(null);
  }

  function confirmAndClose() {
    if (!state) return;
    state.onConfirm();
    setState(null);
  }

  return { state, ask, cancel, confirmAndClose };
}

export function ConfirmDialog({
  state,
  onCancel,
  onConfirm,
}: {
  state: { message: string } | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-6 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-xs rounded-xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 4 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: "#fef2f2" }}
            >
              <TriangleAlert size={18} strokeWidth={2} className="text-red-500" />
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: toss.color.foreground }}>
              {state?.message}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-100"
                style={{ color: toss.color.muted }}
              >
                취소
              </button>
              <button
                onClick={onConfirm}
                className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
              >
                확인
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
