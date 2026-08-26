import {
  IconBriefcase2,
  IconEyeSearch,
  IconGlobeFilled,
  IconAnalyze,
  IconBounceRight,
} from "@tabler/icons-react";

export function BenefitSectionDemo() {
  const features = [
    {
        title: "방대한 구인구직 게시판",
        description: "워킹홀리데이 참가자들을 위해 맞춤형 일자리 기회를 다양하게 탐색해보세요.",
        icon: <IconBriefcase2 />,
    },
    {
        title: "고급 검색 기능",
        description: "여러분의 능력에 맞는 기회를 찾을 수 있도록 카테고리별 맞춤 검색 도구를 제공합니다.",
        icon: <IconEyeSearch />,
    },
    {
        title: "상세한 국가별 가이드",
        description: "취업 시장과 문화적 인사이트를 포함한 워킹홀리데이 필수 정보를 확인하세요.",
        icon: <IconGlobeFilled />,
    },
    {
        title: "단계별 신청 절차",
        description: "명확하고 포괄적인 가이드로 비자 신청 과정을 순조롭게 진행하세요.",
        icon: <IconAnalyze />,
    },
    {
        title: "사용자 친화적 경험",
        description: "효율적이고 스트레스 없는 구직 활동을 위한 최적화된 플랫폼을 경험하세요.",
        icon: <IconBounceRight />,
    },
];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          워킹홀리데이 경험을 극대화하세요
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          해외에서의 성공적이고 보람찬 모험을 위한 맞춤형 기능을 활용해보세요.
        </p>
      </div>
      <div className="mt-10 grid w-full grid-cols-1 border-l border-t border-zinc-200 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div className="flex flex-col border-b border-r border-zinc-200 py-8">
      <div className="mb-4 px-6 text-blue-700">
        {icon}
      </div>
      <div className="mb-2 px-6 text-lg font-bold">
        <span className="text-neutral-800">
          {title}
        </span>
      </div>
      <p className="max-w-xs px-6 text-sm leading-6 text-neutral-600">
        {description}
      </p>
    </div>
  );
};
