'use client'

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from "next/link";
import UserBar from "./userbar";
import {cn} from "@/lib/utils";

interface Profile {
  firstName: string;
  lastName: string;
  userName: string;
  photo: string;
  enableScrollAnimation?: boolean;
  lightNotice?: boolean;
}

export default function BarforHeader({ 
  firstName, 
  lastName, 
  userName, 
  photo, 
  enableScrollAnimation = true,
  lightNotice = false,
}: Profile) {
  const [banner, setBanner] = useState(true)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [BannerVisible, setBannerVisible] = useState(true)

  useEffect(() => {
    if (!enableScrollAnimation) return;

    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isBannerVisible = currentScrollPos < 50
      const isNavbarVisible = prevScrollPos > currentScrollPos

      setBannerVisible(banner && isBannerVisible)
      setVisible(isNavbarVisible || currentScrollPos < 10)
      setPrevScrollPos(currentScrollPos)
      setHasScrolled(true)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos, banner, enableScrollAnimation])

  function handleClick() {
    setBanner(false)
    setBannerVisible(false)
  }

  return (
    <div className={enableScrollAnimation ? "relative w-full" : "w-full"}>
      <div className={enableScrollAnimation ? "fixed top-0 left-0 right-0 z-50" : ""}>
        {BannerVisible && (
          <div className={cn(
            "flex h-[50px] w-full items-center justify-center gap-x-2 border-b px-3 sm:gap-x-5",
            lightNotice
              ? "border-[var(--color-chart-yellow-ink)] bg-[var(--color-chart-yellow)] text-[var(--color-chart-yellow-ink)]"
              : "border-zinc-800 bg-zinc-800 text-white"
          )}>
            <svg className="hidden h-5 w-5 shrink-0 sm:block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
            </svg>
            <p className="text-[11px] leading-tight sm:text-sm">Job and visa information can change. Confirm details with the official source.</p>
            <button onClick={handleClick} className="shrink-0 p-1" aria-label="Dismiss notice">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div 
          className={cn(
            "w-full z-40 flex items-center bg-white py-4 justify-between",
            enableScrollAnimation && "shadow-md shadow-b",
            enableScrollAnimation && hasScrolled && "transition-transform duration-300 ease-in-out",
            enableScrollAnimation && (visible ? "translate-y-0" : "-translate-y-full")
          )}
          style={{
            top: BannerVisible && enableScrollAnimation ? '50px' : '0',
          }}
        >
          <Link href="/" className="ml-5 whitespace-nowrap text-2xl font-bold tracking-tight sm:ml-10">VIKB</Link>
          <div className="mr-3 flex items-center gap-2 sm:mr-8 sm:gap-5">
            <Link href="/jobs?country=australia" className="whitespace-nowrap rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 sm:px-4 sm:text-sm">
              Jobs →
            </Link>
            <UserBar firstName={firstName} lastName={lastName} userName={userName} photo={photo} />
          </div>
        </div>
      </div>
    </div>
  )
}
