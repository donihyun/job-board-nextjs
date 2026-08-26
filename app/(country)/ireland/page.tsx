import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryGuide from "@/components/country-guide";
import { workVisaList } from "@/constants/visas";

export const metadata: Metadata = { title: "아일랜드 워킹홀리데이 비자와 일자리", description: "대한민국 여권 기준 아일랜드 워킹홀리데이 조건과 현지 일자리를 확인하세요." };

export default function IrelandPage() {
  const visa = workVisaList.find((item) => item.country === "Ireland" && item.category === "Working holiday");
  if (!visa) notFound();
  return <CountryGuide routeKey="ireland" visa={visa} />;
}
