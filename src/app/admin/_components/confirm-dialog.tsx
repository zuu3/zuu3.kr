"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TriangleAlert } from "lucide-react";
import { toss } from "@/app/blog/toss-tokens";

type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
};

// 브라우저 기본 confirm()은 에디터 화면 전체와 스타일이 안 맞는다. 삭제,
// 저장 안 하고 나가기처럼 "확인이 필요한 위험한 동작"이 이 훅 하나로
// 재사용된다 - 모달 상태와 모달 자체를 한 파일에 묶어서, 쓰는 쪽에서는
// ask()만 호출하고 <ConfirmDialog />만 렌더링하면 되게 했다.
export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmRequest | null>(null);

  function ask(request: ConfirmRequest) {
    setState(request);
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
  state: ConfirmRequest | null;
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
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            style={{ border: `1px solid ${toss.color.border}` }}
            onClick={(e) => e.stopPropagation()}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 6 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: "#fef2f2" }}
            >
              <TriangleAlert size={20} strokeWidth={2} className="text-red-500" />
            </div>
            <p className="mt-4 text-base font-bold" style={{ color: toss.color.foreground }}>
              {state?.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: toss.color.body }}>
              {state?.description}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                style={{ color: toss.color.body, backgroundColor: toss.color.surface }}
              >
                취소
              </button>
              <button
                onClick={onConfirm}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-px hover:bg-red-600 hover:shadow-md active:translate-y-0"
              >
                {state?.confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
