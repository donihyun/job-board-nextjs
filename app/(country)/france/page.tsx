import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryGuide from "@/components/country-guide";
import { workVisaList } from "@/constants/visas";

export const metadata: Metadata = { title: "프랑스 워킹홀리데이 비자와 일자리 — VIKB", description: "대한민국 여권 기준 프랑스 워킹홀리데이 조건을 확인하고 실제 채용공고를 직종별로 검색하세요." };

export default function FrancePage() {
  const visa = workVisaList.find((item) => item.country === "France" && item.category === "Working holiday");
  if (!visa) notFound();
  return <CountryGuide routeKey="france" visa={visa} />;
}
