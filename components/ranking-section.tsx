'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const cities = [
  { city: "Dublin", country: "ireland", image: "/dublin-landing.jpg", span: "md:col-span-4", korean: "더블린" },
  { city: "Berlin", country: "germany", image: "/germany/bg.jpg", span: "md:col-span-4", korean: "베를린" },
  { city: "Lisbon", country: "portugal", image: "/lisbon-landing.jpg", span: "md:col-span-4", korean: "리스본" },
  { city: "Toronto", country: "canada", image: "/toronto-landing.jpg", span: "md:col-span-4", korean: "토론토" },
  { city: "Tokyo", country: "japan", image: "/tokyo-landing.jpg", span: "md:col-span-8", korean: "도쿄" },
  { city: "Barcelona", country: "spain", image: "/barcelona-landing.jpg", span: "md:col-span-12", korean: "바르셀로나" }
];

export default function CitiesGrid() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {cities.map((city, index) => (
        <motion.div
          key={city.city}
          className={`group relative col-span-12 min-w-0 overflow-hidden rounded-lg ${city.span}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/jobs?${new URLSearchParams({ country: city.country, location: city.city })}`} className="block h-full">
            <div className="relative h-full w-full min-h-[200px]">
              <Image
                src={city.image}
                alt={city.city}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {city.korean}
                </h3>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

    </div>
  )
}
