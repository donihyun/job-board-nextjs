'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "워킹홀리데이 비자가 정확히 뭔가요? 🤔",
    answer: "워홀 비자는 젊은 분들이 외국에서 일하면서 여행도 할 수 있는 특별한 비자예요! 보통 1-2년 동안 현지에서 일하면서 여행 자금도 모으고, 새로운 문화도 경험할 수 있답니다. 특별한 점은 학업도 병행할 수 있다는 거예요! ✈️"
  },
  {
    question: "어떤 나라에서 워홀을 할 수 있나요? 🌏",
    answer: "인기 있는 워홀 국가가 정말 많아요! 호주, 뉴질랜드, 캐나다처럼 영어권 국가부터 일본이나 유럽의 여러 나라까지 선택지가 다양합니다. 나라마다 조건이 조금씩 달라요. 요즘 특히 인기 있는 곳은 호주, 일본, 캐나다예요! 🇦🇺🇯🇵🇨🇦"
  },
  {
    question: "워홀 비자로 얼마나 오래 체류할 수 있어요? ⏰",
    answer: "대부분 나라는 기본 1년을 주고요, 호주같은 경우는 조건만 맞으면 최대 3년까지도 가능해요! 나라마다 규정이 다르니 미리 체크하시는 게 좋아요. 그리고 중간에 다른 나라로 여행 다녀오는 것도 가능하답니다! 🎒"
  },
  {
    question: "어떤 일을 할 수 있나요? 💼",
    answer: "생각보다 선택지가 엄청 많아요! 카페나 레스토랑 같은 서비스직이 가장 흔하고, 농장 일도 인기가 많아요. 사무직이나 본인 전공 관련 인턴십도 가능하답니다. 요즘은 IT 관련 일자리도 많이 있어요! 본인의 영어 실력과 경험에 따라 다양한 기회가 있으니 걱정마세요~ 🏢🏡"
  },
  {
    question: "현지 언어를 잘해야 하나요? 🗣",
    answer: "영어권 국가라면 기본 회화만 가능해도 충분해요! 비영어권 국가도 처음에는 영어로 시작하시는 분들이 많답니다. 물론 현지 언어를 조금이라도 할 줄 알면 더 좋은 기회를 잡을 수 있어요. 현지에서 배우면서 실력을 키우시는 것도 좋은 방법이에요! 📚"
  }
]

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="px-8">
          <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            워킹홀리데이 궁금증 해결! 🌟
          </h4>

          <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
            성공적인 워홀 생활을 위한 꿀팁 모음! 놓치지 마세요 ✨
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="flex justify-between items-center w-full text-left p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="p-4 bg-white rounded-b-lg shadow-md">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
