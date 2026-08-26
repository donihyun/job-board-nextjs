import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "VIKB — Australia Working Holiday Jobs",
  description: "Australian jobs and practical working holiday information.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <ClerkProvider appearance={{
      variables: {
        colorPrimary: 'blue',
        colorText: 'black',
      },
    }}>
    <html lang="en">
      {adsenseClient && (
        <Script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="afterInteractive"
        />
      )}
      <body className={cn("antialiased bg-background", notoSans.variable, spaceGrotesk.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
