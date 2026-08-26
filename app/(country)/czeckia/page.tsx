import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryGuide from "@/components/country-guide";
import { workVisaList } from "@/constants/visas";

export const metadata: Metadata = { title: "체코 워킹홀리데이 비자와 일자리 — VIKB", description: "대한민국 여권 기준 체코 워킹홀리데이 조건을 확인하고 실제 채용공고를 직종별로 검색하세요." };

export default function CzechiaPage() {
  const visa = workVisaList.find((item) => item.country === "Czechia" && item.category === "Working holiday");
  if (!visa) notFound();
  return <CountryGuide routeKey="czeckia" visa={visa} />;
}
