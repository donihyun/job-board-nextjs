"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, FileText, Briefcase, Home } from 'lucide-react'
import { checks } from "@/constants/checklist";
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import React from "react";

const tabInfo = [
  { key: "eligibility", icon: Check, label: "Eligibility" },
  { key: "documents", icon: FileText, label: "Documents" },
  { key: "employment", icon: Briefcase, label: "Employment" },
  { key: "living", icon: Home, label: "Living" },
]

const tabStyles = {
  eligibility: "from-violet-500 to-purple-500",
  documents: "from-indigo-500 to-blue-500",
  employment: "from-red-500 to-pink-500",
  living: "from-sky-500 to-cyan-500",
}
const iconStyles = {
  eligibility: "text-violet-500 ",
  documents: "text-indigo-500 ",
  employment: "text-red-500 ",
  living: "text-sky-500",
}

const CheckList = ({ country }: { country: string }) => {
  const countryData = checks.find((e) => e.country === country)
  
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Things to Check Before Going to {country}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ensure a smooth transition with our comprehensive checklist covering eligibility, documents, employment, and living arrangements.
        </p>
      </div>

      <Tabs defaultValue="eligibility" className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-6 mb-10">
          {tabInfo.map(({ key, icon: Icon, label }) => (
            <TabsTrigger
              key={key}
              value={key}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full text-md font-medium transition-all",
                "border-2 border-transparent",
                "hover:bg-gray-100",
                "data-[state=active]:text-white data-[state=active]:border-transparent",
                "data-[state=active]:shadow-md",
                `data-[state=active]:bg-gradient-to-r ${tabStyles[key as keyof typeof tabStyles]}`
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabInfo.map(({ key }) => {
          const categoryData = countryData?.[key as keyof typeof countryData] as Array<{title: string; description: string}> | undefined;
          const items = categoryData || [];

          return (
            <TabsContent key={key} value={key} className="space-y-6">
              {items.map((item, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                        `bg-${key.split('-')[0]}-100 text-${key.split('-')[0]}-600`
                      )}>
                        {tabInfo.find(tab => tab.key === key)?.icon &&
                          React.createElement(tabInfo.find(tab => tab.key === key)!.icon, { className: `text-h-6 w-6 ${iconStyles[key as keyof typeof iconStyles]}` })}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold leading-tight tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {items.length === 0 && (
                <Card className="overflow-hidden border-none shadow-md">
                  <CardContent className="p-6">
                    <p className="text-center text-gray-600">No information available for this category.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  )
}

export default CheckList;

