import "./global.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Devunpacker - 개발자를 위한 기술 블로그",
    template: "%s | Devunpacker",
  },
  description: "웹 개발, 프론트엔드, 백엔드, DevOps 등 다양한 개발 기술과 경험을 공유하는 기술 블로그입니다. React, Next.js, TypeScript, Node.js 등의 최신 기술 스택과 실무 경험을 다룹니다.",
  keywords: ["개발 블로그", "기술 블로그", "웹 개발", "프론트엔드", "백엔드", "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "DevOps", "프로그래밍"],
  authors: [{ name: "Devunpacker" }],
  creator: "Devunpacker",
  publisher: "Devunpacker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Devunpacker - 개발자를 위한 기술 블로그",
    description: "웹 개발, 프론트엔드, 백엔드, DevOps 등 다양한 개발 기술과 경험을 공유하는 기술 블로그입니다.",
    url: baseUrl,
    siteName: "Devunpacker",
    images: [
      {
        url: "/api/og?title=Devunpacker&description=개발자를 위한 기술 블로그",
        width: 1200,
        height: 630,
        alt: "Devunpacker - 개발자를 위한 기술 블로그",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devunpacker - 개발자를 위한 기술 블로그",
    description: "웹 개발, 프론트엔드, 백엔드, DevOps 등 다양한 개발 기술과 경험을 공유하는 기술 블로그입니다.",
    images: ["/api/og?title=Devunpacker&description=개발자를 위한 기술 블로그"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: "ApZE7yRjTYfTuhj38N8Dvj6gCQZASG8cUPeiYKoCH6Q",
    other: {
      me: ["relee6203@gmail.com"],
    },
  },
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Devunpacker",
  "alternateName": "Devunpacker 기술 블로그",
  "url": baseUrl,
  "description": "웹 개발, 프론트엔드, 백엔드, DevOps 등 다양한 개발 기술과 경험을 공유하는 기술 블로그",
  "publisher": {
    "@type": "Person",
    "name": "Devunpacker"
  },
  "inLanguage": "ko-KR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6927905151492991"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      <body className={cx("antialiased min-h-screen")}>
        <ThemeProvider attribute="class">
          <div className="max-w-4xl mb-40 flex flex-col md:flex-row mx-4 mt-8 lg:mx-auto">
            <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
              <Navbar />
              {children}
              <Analytics />
              <SpeedInsights />
              <Footer />
            </main>
          </div>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-SCRW74NQ0X" />
      </body>
    </html>
  );
}
