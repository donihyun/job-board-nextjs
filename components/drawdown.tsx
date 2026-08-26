"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

export const countryData = {
  oceania: [
    { value: "australia", label: "호주", flag: "/australia.png" },
    { value: "newzealand", label: "뉴질랜드", flag: "/newzealand.png" },
  ],
  europe: [
    { value: "austria", label: "오스트리아", flag: "/austria.png" },
    { value: "belgium", label: "벨기에", flag: "/belgium.png" },
    { value: "czechia", label: "체코", flag: "/czech republic.png" },
    { value: "denmark", label: "덴마크", flag: "/denmark.png" },
    { value: "finland", label: "핀란드", flag: "/finland.png" },
    { value: "france", label: "프랑스", flag: "/france.png" },
    { value: "germany", label: "독일", flag: "/germany.png" },
    { value: "hungary", label: "헝가리", flag: "/hungary.png" },
    { value: "ireland", label: "아일랜드", flag: "/ireland.png" },
    { value: "italy", label: "이탈리아", flag: "/italy.png" },
    { value: "netherlands", label: "네덜란드", flag: "/netherlands.png" },
    { value: "norway", label: "노르웨이", flag: "/norway.png" },
    { value: "poland", label: "폴란드", flag: "/poland.png" },
    { value: "portugal", label: "포르투갈", flag: "/portugal.png" },
    { value: "spain", label: "스페인", flag: "/spain.png" },
    { value: "sweden", label: "스웨덴", flag: "/sweden.png" },
    { value: "uk", label: "영국", flag: "/united kingdom.png" },
  ],
  america: [
    { value: "canada", label: "캐나다", flag: "/canada.png" },
    { value: "chile", label: "칠레", flag: "/chile.png" },
  ],
  asia: [
    { value: "japan", label: "일본", flag: "/japan.png" },
    { value: "taiwan", label: "대만", flag: "/taiwan.png" },
  ],
};
type ContinentKey = 'oceania' | 'europe' | 'america' | 'asia';
type ContinentDictionary = {
  [key in ContinentKey]: string;
};
export default function DrawDown() {

  const continentNames:ContinentDictionary = {
    oceania: "오세아니아",
    europe: "유럽",
    america: "아메리카",
    asia: "아시아"
  };

  return (
    <Sheet>
      <SheetTrigger>워킹홀리데이</SheetTrigger>
      <SheetContent side="top" className="h-screen lg:h-[85%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="mt-7 ml-5 text-2xl">
            워킹홀리데이
          </SheetTitle>
          <SheetDescription className="ml-5 mt-7 text-md">
            한국인이 워킹홀리데이를 떠날 수 있는 국가 목록입니다.
          </SheetDescription>
          <div className="ml-5">
            {Object.entries(countryData).map(([continent, countries]) => (
              <div key={continent} className="mt-8">
                <h2 className="font-semibold text-xl mb-5">
                  {
                  continent in continentNames
                  ?
                  continentNames[continent as ContinentKey]
                  :"unknown content"
                  }
                </h2>
                <div className="grid grid-cols-4 justify-start lg:grid-cols-5 gap-y-5">
                  {countries.map((country) => (
                    <a
                      href={`/${country.value}`}
                      key={country.value}
                      className="transition overflow-hidden hover:scale-105 flex gap-x-4"
                    >
                      <Image
                        src={`${country.flag}`}
                        alt={country.label}
                        width={23}
                        height={20}
                      />
                      <span className="font-semibold">{country.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}