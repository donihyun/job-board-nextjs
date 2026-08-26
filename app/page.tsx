'use client'

import { motion } from 'framer-motion'
import RankingSection from '@/components/ranking-section'
import FAQSection from '@/components/faq-section'
import ComboboxForm from '@/components/combobox'
import Bar from '@/components/bar'
import Link from 'next/link'
import CtaSection from '@/components/ctasection'
import { BenefitSectionDemo } from '@/components/landingpagebenefit'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* Hero Section with Diagonal Split */}
      <div className="relative min-h-[100svh] overflow-hidden">
      <Bar />
      
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: 'url(/newzealand/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-[100svh] items-center px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <motion.div
          className="w-full max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid items-center gap-10 md:grid-cols-12 lg:gap-16">
            {/* Left Side - Title and Text */}
            <div className="md:col-span-6 text-left">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium">
                  워킹 홀리데이 비자 지원 가능
                </span>
                
                <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  당신의
                  <span className="block mt-2">완벽한 워킹</span>
                  <span className="block mt-2 text-blue-300">
                    홀리데이를 찾아보세요
                  </span>
                </h1>
                
                <p className="text-xl text-white/90 max-w-2xl">
                  전 세계의 기회와 모험을 탐험하세요
                </p>
              </motion.div>
            </div>

            {/* Right Side - Search Box */}
            <motion.div 
              className="md:col-span-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="rounded-lg border border-white/20 bg-black/20 p-5 backdrop-blur-md sm:p-7">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      여행지를 찾아보세요
                    </h3>
                    <p className="text-sm text-white/70 mt-1">
                      국가를 선택하고 최신 채용공고를 검색하세요
                    </p>
                  </div>
                  
                  <ComboboxForm />
                  
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-white/80">
                      인기 여행지
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: '도쿄', country: 'japan', location: 'Tokyo' },
                        { name: '베를린', country: 'germany', location: 'Berlin' },
                        { name: '토론토', country: 'canada', location: 'Toronto' },
                      ].map((city) => (
                        <Link
                          key={city.name}
                          href={`/jobs?${new URLSearchParams({ country: city.country, location: city.location })}`}
                          className="px-3 py-1.5 text-sm text-white/90 bg-white/10 rounded-lg 
                                   hover:bg-white/20 transition-colors duration-200"
                        >
                          {city.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </div>
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          {/* Title Section */}
          <div className="mb-10 text-center sm:mb-12">
            <span className="text-sm font-semibold tracking-wider text-zinc-500 uppercase mb-3 block">
              인기 여행지
            </span>
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 sm:text-4xl">
              글로벌 도시 탐험
            </h2>
            <div className="mx-auto max-w-2xl">
              <p className="text-base text-zinc-600 sm:text-lg">
                활기찬 대도시의 독특한 장소를 발견하세요
              </p>
            </div>
          </div>
            <RankingSection />
        </div>
      </section>

      <BenefitSectionDemo/>

      <FAQSection />

      {/* CTA Section */}
     <CtaSection/>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="hidden">
            <div>
              <h3 className="text-lg font-semibold mb-4">회사 소개</h3>
              <p className="text-sm">우리는 전 세계의 여행자들에게 삶을 바꾸는 워킹 홀리데이 기회를 제공하는 데 열정을 가지고 있습니다.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">인기 여행지</h3>
              <ul className="text-sm">
                <li className="mb-2">호주</li>
                <li className="mb-2">뉴질랜드</li>
                <li className="mb-2">캐나다</li>
                <li className="mb-2">일본</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">리소스</h3>
              <ul className="text-sm">
                <li className="mb-2">비자 정보</li>
                <li className="mb-2">구인 게시판</li>
                <li className="mb-2">여행 팁</li>
                <li className="mb-2">자주 묻는 질문</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">연락처</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-white/70 sm:flex-row">
            <p>&copy; 2026 VIKB · Australia working holiday jobs</p>
            <Link href="/jobs?country=australia" className="font-medium text-white hover:text-blue-300">
              Search jobs →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
