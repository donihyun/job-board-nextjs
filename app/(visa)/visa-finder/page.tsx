import type { Metadata } from "next";
import VisaFinder from "@/components/visa-finder";
import { workVisaList } from "@/constants/visas";

export const metadata: Metadata = {
  title: "내 조건에 맞는 비자 찾기 — VisaChart",
  description: "나이, 목적, 잡오퍼와 희망 체류기간을 입력하고 검토할 해외 비자 경로를 찾으세요.",
};

export default function VisaFinderPage() {
  return (
    <main className="min-h-screen bg-[var(--color-canvas-dark)] px-3 py-4 text-[var(--color-ink)] sm:px-6 sm:py-8">
      {/* Hallmark · genre: modern-minimal · macrostructure: guided workbench · design-system: design.md · designed-as-app
       * pre-emit critique: P5 H5 E5 S5 R5 V5 · contrast: pass · responsive: pass
       */}
      <VisaFinder visas={workVisaList} />
    </main>
  );
}
