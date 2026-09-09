"use client";

import { useEffect, useRef } from "react";

type BackupData = { title: string; excerpt: string; tags: string; content: string };
type StoredBackup = BackupData & { savedAt: number };

// beforeunload로 나가는 것만 막아도, 브라우저가 강제 종료되거나 탭이
// 죽으면 그냥 다 날아간다. 1초 디바운스로 로컬에 계속 스냅샷을 남겨두고,
// 다음에 같은 글을 열었을 때 그게 서버에 저장된 내용과 다르면 복구를
// 제안할 수 있게 한다. 서버 저장이 아니라 "탭이 죽었을 때의 안전망"이라
// Supabase까지 안 가고 localStorage로 충분하다.
export function useLocalBackup(key: string, data: BackupData, enabled: boolean) {
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data.title, data.excerpt, data.tags, data.content]);

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      const backup: StoredBackup = { ...dataRef.current, savedAt: Date.now() };
      try {
        localStorage.setItem(key, JSON.stringify(backup));
      } catch {
        // 저장 공간이 꽉 찼거나 프라이빗 모드라 막힌 경우 - 안전망이 없어질
        // 뿐이니 조용히 넘어간다.
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [key, data.title, data.excerpt, data.tags, data.content, enabled]);

  function readBackup(): StoredBackup | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as StoredBackup) : null;
    } catch {
      return null;
    }
  }

  function clearBackup() {
    try {
      localStorage.removeItem(key);
    } catch {
      // no-op
    }
  }

  return { readBackup, clearBackup };
}
