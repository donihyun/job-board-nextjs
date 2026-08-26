/* Hallmark · component: ad slot · genre: modern-minimal · design-system: design.md
 * pre-emit critique: P5 H5 E5 S5 R5 V5 · tokens: pass · responsive: pass
 */
"use client";

import { useEffect, useRef } from "react";

type Props = { slot?: string; className?: string };

export default function AdSlot({ slot, className = "" }: Props) {
  const loaded = useRef(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot || loaded.current) return;
    try {
      const adsWindow = window as Window & { adsbygoogle?: Record<string, unknown>[] };
      (adsWindow.adsbygoogle ||= []).push({});
      loaded.current = true;
    } catch {
      // Ad blockers and delayed scripts may prevent initialization; content still renders.
    }
  }, [client, slot]);

  if (!client || !slot) {
    return (
      <aside aria-label="광고 위치 미리보기" className={`my-6 border-y-2 border-[var(--color-rule)] py-3 ${className}`}>
        <div className="flex min-h-[90px] w-full flex-col items-center justify-center border-2 border-dashed border-[var(--color-filter-rule)] bg-[var(--color-filter-surface)] px-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-selected)]">Advertisement preview</p>
          <p className="mt-1 text-xs text-[var(--color-ink-2)]">반응형 광고 슬롯 · AdSense 연결 시 자동 교체</p>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="광고" className={`my-6 border-y-2 border-[var(--color-rule)] py-3 ${className}`}>
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-2)]">광고</p>
      <ins
        className="adsbygoogle block min-h-[90px] w-full"
        data-ad-client={client}
        data-ad-format="auto"
        data-ad-slot={slot}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
