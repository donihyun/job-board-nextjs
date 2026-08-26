import type { MetadataRoute } from "next";
import { visaGuides } from "@/constants/visa-guides";
import { workVisaList } from "@/constants/visas";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vikb-work-holiday.netlify.app";
  const countryRoutes = ["andorra", "brazil", "chile", "hong-kong", "israel", "italy", "japan", "latvia", "luxembourg", "portugal"];
  return [
    { url: `${baseUrl}/visachart`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/visa-finder`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/working-holiday`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/visa-guides`, changeFrequency: "weekly", priority: 0.8 },
    ...visaGuides.map(({ slug }) => ({ url: `${baseUrl}/visa-guides/${slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...countryRoutes.map((route) => ({ url: `${baseUrl}/${route}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...workVisaList.map(({ slug }) => ({ url: `${baseUrl}/visachart/${slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
