"use client";

import { useState } from "react";

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
  if (!state) return null;
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-6">
      <div className="w-full max-w-xs rounded-md bg-white p-5 shadow-lg">
        <p className="text-sm leading-relaxed text-neutral-800">{state.message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-500 hover:bg-neutral-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-600"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
