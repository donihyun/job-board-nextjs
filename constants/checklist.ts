import type { CountryChecklistData } from "@/lib/types";

export const checks: CountryChecklistData[] = [
  {
      country: "canada",
      eligibility: [
          {
              title: '국적 요건',
              description: '참여 가능 국가의 시민권자여야 합니다.'
          },
          {
              title: '연령 요건',
              description: '18세에서 35세 사이여야 합니다 (일부 국가의 경우 18-30세).'
          },
          {
              title: '여권',
              description: '유효한 여권을 소지해야 합니다.'
          },
          {
              title: '기타 요건',
              description: '충분한 자금 증명, 귀국 항공권, 또는 설명서와 같은 기타 요건을 충족해야 합니다.'
          },
          {
              title: '의료 보험',
              description: '캐나다 체류 전 기간 동안 의료, 입원, 본국 송환을 보장하는 의료 보험에 가입해야 합니다.'
          }
      ],
      documents: [
          {
              title: '여권',
              description: '캐나다 워킹홀리데이 신청을 위해 유효한 여권이 필요합니다.'
          },
          {
              title: '자금 증명서',
              description: '캐나다 체류 기간 동안의 생활비를 충당할 수 있는 충분한 자금 증명이 필요합니다.'
          },
          {
              title: '의료 보험',
              description: '캐나다 체류 전 기간 동안 의료, 입원, 본국 송환을 보장하는 의료 보험에 가입해야 합니다.'
          },
          {
              title: '범죄경력증명서',
              description: '신청 과정에서 범죄경력증명서 제출이 요구될 수 있습니다.'
          },
          {
              title: '어학 능력',
              description: '신청하는 카테고리에 따라 영어 또는 프랑스어 어학 능력 요건을 충족해야 합니다.'
          }
      ],
      employment: [
          {
              title: '구직 준비',
              description: '캐나다 취업 시장에 맞춘 이력서와 자기소개서를 준비하고 취업 기회를 조사하세요.'
          },
          {
              title: '여행 서류 확인',
              description: '예정된 체류 기간 이후 최소 6개월 이상 유효한 여권을 준비하고 비자 요건을 확인하세요.'
          },
          {
              title: '재정 준비',
              description: '여행 계획을 은행에 통지하고 캐나다 현지 은행 계좌 개설을 고려하세요.'
          }
      ],
      living: [
          {
              title: '의료 보험',
              description: '캐나다 체류 기간 동안의 의료비를 보장하는 여행자 보험에 가입하세요.'
          },
          {
              title: '숙소 준비',
              description: '도착 후 머물 호텔이나 호스텔과 같은 임시 숙소를 예약하세요.'
          },
          {
              title: '필수품 준비',
              description: '캐나다의 기후에 맞는 의류, 중요 서류, 개인 용품을 준비하세요.'
          },
          {
              title: '연락처 공유',
              description: '안전을 위해 여행 일정과 연락처를 가족이나 친구와 공유하세요.'
          },
          {
              title: '현지 문화 이해',
              description: '원활한 적응을 위해 캐나다의 문화, 관습, 예절을 미리 익히세요.'
          },
          {
              title: '도착 준비',
              description: '공항에서 숙소까지의 교통편과 주변 편의시설을 미리 조사하세요.'
          },
          {
              title: '비상 연락망',
              description: '현지 당국과 한국 대사관을 포함한 비상 연락처 목록을 준비하세요.'
          }
      ]
  },
  {
      country: "australia",
      eligibility: [
          {
              title: '연령 제한',
              description: '18세에서 30세 사이여야 합니다 (일부 경우 35세까지 가능).'
          },
          {
              title: '여권 요건',
              description: '호주 워킹홀리데이 프로그램 참여 가능 국가의 여권을 소지해야 합니다.'
          },
          {
              title: '이전 워킹홀리데이 비자',
              description: '이전에 호주 워킹홀리데이 비자(서브클래스 417 또는 462)로 입국한 적이 없어야 합니다.'
          },
          {
              title: '지정 작업 요건',
              description: '대부분의 경우, 두 번째 워킹홀리데이 비자를 신청하려면 첫 번째 워킹홀리데이 비자로 호주 지방에서 3개월간의 지정된 작업을 완료해야 합니다.'
          },
          {
              title: '건강 및 신원 요건',
              description: '특정 건강 및 신원 요건을 충족해야 합니다.'
          },
          {
              title: '재정 요건',
              description: '호주에서의 생활을 위한 충분한 자금(일반적으로 AUD $5,000)이 있어야 합니다.'
          }
      ],
      documents: [
          {
              title: '신분증',
              description: '여권 및 기타 신분증.'
          },
          {
              title: '재정 증명',
              description: '호주 체류를 위한 자금 증명(일반적으로 AUD $5,000).'
          },
          {
              title: '건강 요건',
              description: '특정 건강 요건 충족.'
          },
          {
              title: '신원 요건',
              description: '특정 신원 요건 충족.'
          },
          {
              title: '범죄경력증명서',
              description: '범죄경력증명서 제출이 요구될 수 있습니다.'
          }
      ],
      employment: [
          {
              title: '구직 준비',
              description: '호주 취업 시장에 맞춘 이력서와 자기소개서를 준비하고 취업 기회를 조사하세요.'
          },
          {
              title: '여행 서류 확인',
              description: '예정된 체류 기간 이후 최소 6개월 이상 유효한 여권을 준비하고 비자 요건을 확인하세요.'
          },
          {
              title: '재정 준비',
              description: '여행 계획을 은행에 통지하고 호주 현지 은행 계좌 개설을 고려하세요.'
          }
      ],
      living: [
          {
              title: '의료 보험',
              description: '호주 체류 기간 동안의 의료비를 보장하는 여행자 보험에 가입하세요.'
          },
          {
              title: '숙소 준비',
              description: '도착 후 머물 호텔이나 호스텔과 같은 임시 숙소를 예약하세요.'
          },
          {
              title: '필수품 준비',
              description: '호주의 기후에 맞는 의류, 중요 서류, 개인 용품을 준비하세요.'
          },
          {
              title: '연락처 공유',
              description: '안전을 위해 여행 일정과 연락처를 가족이나 친구와 공유하세요.'
          },
          {
              title: '현지 문화 이해',
              description: '원활한 적응을 위해 호주의 문화, 관습, 예절을 미리 익히세요.'
          },
          {
              title: '도착 준비',
              description: '공항에서 숙소까지의 교통편과 주변 편의시설을 미리 조사하세요.'
          },
          {
              title: '비상 연락망',
              description: '현지 당국과 한국 대사관을 포함한 비상 연락처 목록을 준비하세요.'
          }
      ]
  },
  {
      country: "newzealand",
      eligibility: [
          {
              title: '신분 증명',
              description: '유효한 여권을 포함한 신분 증명이 필요합니다.'
          },
          {
              title: '건강',
              description: '필요한 경우 흉부 X-레이 및 건강검진을 포함한 양호한 건강 상태여야 합니다.'
          },
          {
              title: '신원',
              description: '필요한 경우 범죄경력증명서를 포함한 양호한 신원이어야 합니다.'
          },
          {
              title: '진정성 있는 의도',
              description: '비자 조건을 충족하려는 진정성 있는 의도가 있어야 합니다.'
          },
          {
              title: '의료 보험',
              description: '체류 기간 전체를 보장하는 종합 의료 보험이 필요합니다.'
          }
      ],
      documents: [
          {
              title: '연령',
              description: '18-30세 사이여야 합니다.'
          },
          {
              title: '국적',
              description: '대한민국 국적자여야 합니다.'
          },
          {
              title: '출국 여행',
              description: '뉴질랜드를 출국할 수 있는 항공권 또는 구매할 수 있는 충분한 자금이 필요합니다.'
          },
          {
              title: '자금',
              description: '뉴질랜드에서 생활하기 위한 최소 NZD $4,200의 자금이 필요합니다.'
          }
      ],
      employment: [
          {
              title: '구직 준비',
              description: '뉴질랜드 취업 시장에 맞춘 이력서와 자기소개서를 준비하고 취업 기회를 조사하세요.'
          },
          {
              title: '여행 서류 확인',
              description: '예정된 체류 기간 이후 최소 6개월 이상 유효한 여권을 준비하고 비자 요건을 확인하세요.'
          },
          {
              title: '재정 준비',
              description: '여행 계획을 은행에 통지하고 뉴질랜드 현지 은행 계좌 개설을 고려하세요.'
          }
      ],
      living: [
          {
              title: '의료 보험',
              description: '뉴질랜드 체류 기간 동안의 의료비를 보장하는 여행자 보험에 가입하세요.'
          },
          {
              title: '숙소 준비',
              description: '도착 후 머물 호텔이나 호스텔과 같은 임시 숙소를 예약하세요.'
          },
          {
              title: '필수품 준비',
              description: '뉴질랜드의 기후에 맞는 의류, 중요 서류, 개인 용품을 준비하세요.'
          },
          {
              title: '연락처 공유',
              description: '안전을 위해 여행 일정과 연락처를 가족이나 친구와 공유하세요.'
          },
          {
              title: '현지 문화 이해',
              description: '원활한 적응을 위해 뉴질랜드의 문화, 관습, 예절을 미리 익히세요.'
          },
          {
              title: '도착 준비',
              description: '공항에서 숙소까지의 교통편과 주변 편의시설을 미리 조사하세요.'
          },
          {
              title: '비상 연락망',
              description: '현지 당국과 한국 대사관을 포함한 비상 연락처 목록을 준비하세요.'
          }
      ]
  },
  {
      country: "netherlands",
      eligibility: [
          {
              title: '연령',
              description: '18-30세 사이여야 합니다.'
          },
          {
              title: '국적',
              description: '특정 국가의 시민권자여야 합니다 (아르헨티나, 호주, 캐나다, 홍콩, 일본, 뉴질랜드, 한국, 대만, 우루과이).'
          },
          {
              title: '목적',
              description: '체류의 주목적이 취업이 아닌 문화교류여야 합니다.'
          }
      ],
      documents: [
          {
              title: '신청서 작성 및 서명',
              description: '신청서를 작성하고 서명해야 합니다.'
          },
          {
              title: '유효한 여권과 신분증 면 사본',
              description: '유효한 여권과 신분증 면의 사본이 필요합니다.'
          },
          {
              title: '네덜란드 기준에 맞는 여권 사진 2장',
              description: '네덜란드 기준을 충족하는 여권 사진 2장이 필요합니다.'
          }
      ],
      employment: [
          {
              title: '구직 준비',
              description: '네덜란드 취업 시장에 맞는 이력서와 자기소개서를 준비하고 구직 기회를 조사하세요.'
          },
          {
              title: '여행 서류 확인',
              description: '예정된 체류 기간 이후 최소 6개월 이상 유효한 여권을 준비하고 비자 요건을 확인하세요.'
          },
          {
              title: '재정 준비',
              description: '여행 계획을 은행에 통지하고 네덜란드 현지 은행 계좌 개설을 고려하세요.'
          }
      ],
      living: [
          {
              title: '의료 보험',
              description: '네덜란드 체류 기간 동안의 의료비를 보장하는 여행자 보험에 가입하세요.'
          },
          {
              title: '숙소 준비',
              description: '도착 후 머물 호텔이나 호스텔과 같은 임시 숙소를 예약하세요.'
          },
          {
              title: '필수품 준비',
              description: '네덜란드의 기후에 맞는 의류, 중요 서류, 개인 용품을 준비하세요.'
          },
          {
              title: '연락처 공유',
              description: '안전을 위해 여행 일정과 연락처를 가족이나 친구와 공유하세요.'
          },
          {
              title: '현지 문화 이해',
              description: '원활한 적응을 위해 네덜란드의 문화, 관습, 예절을 미리 익히세요.'
          },
          {
              title: '도착 준비',
              description: '공항에서 숙소까지의 교통편과 주변 편의시설을 미리 조사하세요.'
          },
          {
              title: '비상 연락망',
              description: '현지 당국과 한국 대사관을 포함한 비상 연락처 목록을 준비하세요.'
          }
      ]
  },
  {
      country: "austria",
      eligibility: [
          {
              title: "연령 요건",
              description: "프로그램 참가자는 18세에서 30세 사이여야 합니다."
          },
          {
              title: "유효한 여권",
              description: "유효한 여권을 소지해야 합니다."
          },
          {
              title: "귀국 항공권",
              description: "본국으로의 귀국 항공권을 소지해야 합니다."
          },
          {
              title: "충분한 자금",
              description: "오스트리아 체류 기간 동안의 생활비를 충당할 수 있는 충분한 자금이 있어야 합니다."
          },
          {
              title: "의료 보험",
              description: "오스트리아 체류 기간 동안 유효한 의료 보험에 가입해야 합니다."
          }
      ],
      documents: [
          {
              title: "유효한 여권",
              description: "오스트리아 워킹홀리데이 신청을 위해 유효한 여권이 필요합니다."
          },
          {
              title: "신청서 작성",
              description: "작성 완료된 신청서가 필요합니다."
          },
          {
              title: "귀국 항공권",
              description: "본국으로의 귀국 항공권이 필요합니다."
          },
          {
              title: "자금 증명",
              description: "충분한 자금 증명(예: 은행 잔고 증명서, 소득 증명서)이 필요합니다."
          },
          {
              title: "의료 보험",
              description: "오스트리아 체류 기간 동안 유효한 의료 보험 증명이 필요합니다."
          },
          {
              title: "최근 사진",
              description: "최근에 촬영한 사진이 필요합니다."
          }
      ],
      employment: [
          {
              title: '구직 준비',
              description: '오스트리아의 취업 기회를 조사하고 그에 맞게 지원 서류를 준비하세요.'
          },
          {
              title: '자격 확인',
              description: '오스트리아에서 인정되는 자격요건인지 확인하세요.'
          },
          {
              title: '네트워킹',
              description: '오스트리아의 외국인 커뮤니티와 전문가 네트워크에 가입하세요.'
          }
      ],
      living: [
          {
              title: '의료 보험',
              description: '오스트리아에서의 의료비를 보장하는 보험에 가입하세요.'
          },
          {
              title: '숙소 준비',
              description: '도착 시 머물 임시 숙소를 예약하세요.'
          },
          {
              title: '필수품 준비',
              description: '오스트리아의 기후에 맞는 필수품을 준비하세요.'
          },
          {
              title: '기초 독일어 학습',
              description: '기본적인 독일어 문구를 익혀두세요.'
          },
          {
              title: '주변 시설 조사',
              description: '식료품점, 교통수단, 의료시설 등을 미리 알아보세요.'
          },
          {
              title: '현지 문화 이해',
              description: '오스트리아의 문화와 예절을 익히세요.'
          },
          {
              title: '비상 연락망',
              description: '현지 당국을 포함한 비상 연락처 목록을 준비하세요.'
          }
      ]
  },
  {
      country: "germany",
      eligibility: [
          {
              title: "연령",
              description: "신청 시점에 18세에서 30세 사이여야 합니다."
          },
          {
              title: "국적",
              description: "대한민국 국적자여야 합니다."
          },
          {
              title: "가족 동반",
              description: "워킹홀리데이 비자 자격이 없는 배우자나 자녀를 동반할 수 없습니다."
          },
          {
              title: "건강",
              description: "건강한 상태여야 합니다 (의료 증명서는 필요하지 않음)."
          }
      ],
      documents: [
          {
              title: "여권",
              description: "최소 12개월 이상 유효한 여권."
          },
          {
              title: "비자 신청서",
              description: "작성 완료 및 서명된 비자 신청서."
          },
          {
              title: "최근 사진",
              description: "흰색 배경의 최근 여권용 사진."
          },
          {
              title: "재정 증명",
              description: "계좌에 최소 2,000유로가 있음을 증명하는 은행 잔고 증명서."
          },
          {
              title: "여행 보험",
              description: "최소 30,000유로를 보장하는 여행 보험."
          },
          {
              title: "의료 보험",
              description: "최소 30,000유로를 보장하는 의료 보험."
          },
          {
              title: "상해 보험",
              description: "최소 30,000유로를 보장하는 상해 보험."
          },
          {
              title: "동기 설명서",
              description: "독일 워킹홀리데이를 신청하는 이유를 설명하는 동기 설명서 (일부 신청자에게 필요)."
          }
      ],
      employment: [
          {
              title: '구직 준비',
              description: '독일의 취업 기회를 조사하세요.'
          },
          {
              title: '자격 확인',
              description: '독일에서 인정되는 자격인지 확인하세요.'
          },
          {
              title: '네트워킹',
              description: '현지 전문가 그룹과 온라인 커뮤니티에 가입하세요.'
          }
      ],
      living: [
          {
              title: '의료 보험',
              description: '독일 체류 기간 동안의 의료 보험에 가입하세요.'
          },
          {
              title: '숙소 준비',
              description: '도착 전 임시 숙소를 마련하세요.'
          },
          {
              title: '필수품 준비',
              description: '의류와 필요한 서류를 준비하세요.'
          },
          {
              title: '기초 독일어',
              description: '의사소통을 위한 기본적인 독일어 문구를 배우세요.'
          },
          {
              title: '주변 시설 조사',
              description: '현지 식료품점과 교통수단을 알아보세요.'
          },
          {
              title: '현지 문화 이해',
              description: '독일의 문화와 예절을 익히세요.'
          },
          {
              title: '비상 연락망',
              description: '현지 당국을 포함한 주요 비상 연락처를 준비하세요.'
          }
      ]
  },
  {
    country: "germany",
    eligibility: [
        {
            title: "연령 요건",
            description: "신청 시점에 만 18세에서 30세 사이여야 합니다."
        },
        {
            title: "국적 요건",
            description: "대한민국 국적자여야 합니다."
        },
        {
            title: "가족 동반",
            description: "워킹홀리데이 비자 자격이 없는 자녀나 배우자를 동반할 수 없습니다."
        },
        {
            title: "건강 상태",
            description: "건강한 상태여야 합니다 (의료 증명서는 필요하지 않음)."
        }
    ],
    documents: [
        {
            title: "여권",
            description: "최소 12개월 이상 유효한 여권을 소지해야 합니다."
        },
        {
            title: "비자 신청서",
            description: "작성 완료되고 서명된 비자 신청서."
        },
        {
            title: "증명사진",
            description: "흰색 배경의 최근 여권용 사진."
        },
        {
            title: "재정 증명",
            description: "최소 2,000유로 이상의 은행 잔고증명서."
        },
        {
            title: "여행자 보험",
            description: "최소 30,000유로를 보장하는 여행자 보험."
        },
        {
            title: "의료 보험",
            description: "최소 30,000유로를 보장하는 의료 보험."
        },
        {
            title: "상해 보험",
            description: "최소 30,000유로를 보장하는 상해 보험."
        },
        {
            title: "동기 설명서",
            description: "독일 워킹홀리데이를 신청하는 이유를 설명하는 동기 설명서 (특정 신청자에게 요구됨)."
        }
    ],
    employment: [
        {
            title: '구직 활동',
            description: '독일의 취업 기회를 조사하고 준비하세요.'
        },
        {
            title: '자격 검증',
            description: '독일에서 인정되는 자격인지 확인하세요.'
        },
        {
            title: '네트워킹',
            description: '현지 전문가 그룹과 온라인 커뮤니티에 참여하세요.'
        }
    ],
    living: [
        {
            title: '의료 보험',
            description: '독일 체류 기간에 맞는 의료 보험에 가입하세요.'
        },
        {
            title: '숙소 준비',
            description: '도착 전 임시 숙소를 미리 예약하세요.'
        },
        {
            title: '필수품 준비',
            description: '독일 생활에 필요한 의류와 서류를 준비하세요.'
        },
        {
            title: '기초 독일어',
            description: '기본적인 독일어 회화를 익혀두세요.'
        },
        {
            title: '생활 편의시설',
            description: '주변 식료품점과 대중교통 정보를 파악하세요.'
        },
        {
            title: '문화 이해',
            description: '독일의 문화와 예절을 미리 공부하세요.'
        },
        {
            title: '비상 연락처',
            description: '현지 당국과 대사관 등의 비상 연락처를 준비하세요.'
        }
    ]
},
{
    country: "france",
    eligibility: [
        {
            title: "참여 국가",
            description: "프랑스와 협정을 맺은 16개 국가나 지역의 청년 여행자가 지원할 수 있습니다."
        },
        {
            title: "연령 제한",
            description: "18세에서 30세 사이여야 합니다 (31번째 생일 전까지). 단, 아르헨티나, 호주, 캐나다는 35세까지 가능합니다(36번째 생일 전까지)."
        },
        {
            title: "재정 요건",
            description: "협정에 명시된 예상 재정 자원 조건을 충족해야 합니다."
        },
        {
            title: "체류 목적",
            description: "주된 목적이 관광과 프랑스 문화 체험이어야 합니다."
        },
        {
            title: "취업 조건",
            description: "프랑스 행정부의 사전 승인 없이 부수적으로 유급 취업이 가능합니다."
        }
    ],
    documents: [
        {
            title: "유효한 여권",
            description: "최소 12개월 이상 유효한 여권"
        },
        {
            title: "신청서",
            description: "작성 완료 및 서명된 워킹홀리데이 비자 신청서"
        },
        {
            title: "증명사진",
            description: "최근 촬영한 여권용 사진"
        },
        {
            title: "재정 증명",
            description: "최소 2,500유로 이상의 재정 증명서"
        },
        {
            title: "의료 보험",
            description: "프랑스 체류 기간 전체를 보장하는 의료 보험 증명서"
        },
        {
            title: "연령 증명",
            description: "18-30세 또는 18-35세(국적에 따라 다름) 연령 증명"
        },
        {
            title: "국적 증명",
            description: "여권이나 주민등록증으로 국적 증명"
        },
        {
            title: "어학 능력",
            description: "프랑스어 능력 증명(항상 필수는 아님)"
        }
    ],
    employment: [
        {
            title: '구직 준비',
            description: '프랑스의 취업 기회를 알아보세요.'
        },
        {
            title: '자격 확인',
            description: '프랑스에서 인정되는 자격인지 확인하세요.'
        },
        {
            title: '네트워킹',
            description: '프랑스 현지 전문가와 외국인 커뮤니티에 참여하세요.'
        }
    ],
    living: [
        {
            title: '의료 보험',
            description: '프랑스 체류에 필요한 의료 보험에 가입하세요.'
        },
        {
            title: '숙소 준비',
            description: '프랑스 도착 후 머물 임시 숙소를 예약하세요.'
        },
        {
            title: '필수품 준비',
            description: '프랑스의 기후에 맞는 필수품을 준비하세요.'
        },
        {
            title: '기초 프랑스어',
            description: '기본적인 프랑스어 회화를 익혀두세요.'
        },
        {
            title: '주변 시설 확인',
            description: '현지 식료품점과 교통수단을 알아보세요.'
        },
        {
            title: '문화 이해',
            description: '프랑스의 문화와 예절을 공부하세요.'
        },
        {
            title: '비상 연락망',
            description: '프랑스 현지 당국 연락처를 준비하세요.'
        }
    ]
},
{
    country: "spain",
    eligibility: [
        {
            title: "국적 요건",
            description: "대한민국 국적자여야 합니다."
        },
        {
            title: "연령 요건",
            description: "여권상 생년월일 기준 18세에서 30세 사이여야 합니다."
        },
        {
            title: "이전 참가 여부",
            description: "스페인 워킹홀리데이 프로그램에 이전 참가 경험이 없어야 합니다."
        },
        {
            title: "부양가족",
            description: "부양가족을 동반할 수 없습니다."
        }
    ],
    documents: [
        {
            title: "서류 일반 요건",
            description: "모든 서류는 스페인어로 작성되어야 합니다. 영어 원본의 경우 번역이 필요하지 않습니다. 모든 서류는 원본(컬러)과 흑백 사본(앞뒤면)이 함께 필요합니다. 모든 서류의 이름은 여권과 동일해야 하며, 컴퓨터로 작성하고 수기로 서명해야 합니다."
        }
    ],
    employment: [
        {
            title: '구직 활동',
            description: '스페인의 취업 기회를 조사하고 준비하세요.'
        },
        {
            title: '자격 검증',
            description: '스페인에서 인정되는 자격인지 확인하세요.'
        },
        {
            title: '네트워킹',
            description: '현지 전문가 그룹과 외국인 커뮤니티에 참여하세요.'
        }
    ],
    living: [
        {
            title: '의료 보험',
            description: '스페인 체류에 필요한 포괄적인 의료 보험에 가입하세요.'
        },
        {
            title: '숙소 준비',
            description: '도착 후 머물 임시 숙소를 예약하세요.'
        },
        {
            title: '필수품 준비',
            description: '스페인의 계절성 기후를 고려한 필수품을 준비하세요.'
        },
        {
            title: '기초 스페인어',
            description: '기본적인 스페인어 회화를 익혀두세요.'
        },
        {
            title: '주변 시설 확인',
            description: '현지 생활 편의시설과 교통수단을 알아보세요.'
        },
        {
            title: '문화 이해',
            description: '스페인의 문화와 예절을 공부하세요.'
        },
        {
            title: '비상 연락망',
            description: '현지 당국과 대사관 연락처를 준비하세요.'
        }
    ]
},
]