import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryGuide from "@/components/country-guide";
import { workVisaList } from "@/constants/visas";

export const metadata: Metadata = {
  title: "호주 워킹홀리데이 비자와 일자리 — VIKB",
  description: "대한민국 여권 기준 호주 워킹홀리데이 비자 조건을 확인하고 실제 채용공고를 직종별로 검색하세요.",
};

export default function AustraliaPage() {
  const visa = workVisaList.find((item) => item.country === "Australia" && item.category === "Working holiday");
  if (!visa) notFound();
  return <CountryGuide routeKey="australia" visa={visa} />;
}
