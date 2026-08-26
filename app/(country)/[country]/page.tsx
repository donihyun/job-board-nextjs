import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountryGuide from "@/components/country-guide";
import { countryKo, workVisaList } from "@/constants/visas";

const countries = [
  ["andorra", "Andorra"], ["brazil", "Brazil"], ["chile", "Chile"],
  ["hong-kong", "Hong Kong"], ["israel", "Israel"], ["italy", "Italy"],
  ["japan", "Japan"], ["latvia", "Latvia"], ["luxembourg", "Luxembourg"],
  ["portugal", "Portugal"],
] as const;

export const dynamicParams = false;
export const generateStaticParams = () => countries.map(([country]) => ({ country }));

const findCountry = (route: string) => countries.find(([key]) => key === route);

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  const entry = findCountry(params.country);
  if (!entry) return {};
  const name = countryKo[entry[1]] || entry[1];
  return {
    title: `${name} 워킹홀리데이 비자와 일자리`,
    description: `대한민국 여권 기준 ${name} 워킹홀리데이 조건과 현지 일자리를 확인하세요.`,
  };
}

export default function CountryPage({ params }: { params: { country: string } }) {
  const entry = findCountry(params.country);
  if (!entry) notFound();
  const visa = workVisaList.find((item) => item.country === entry[1] && item.category === "Working holiday");
  if (!visa) notFound();
  return <CountryGuide heroImage={null} routeKey={entry[0]} visa={visa} />;
}
