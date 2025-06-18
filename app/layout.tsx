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
    default: "Devunpacker",
    template: "%s | Devunpacker",
  },
  description: "This is my technical blog.",
  openGraph: {
    title: "Devunpacker",
    description: "This is my technical blog.",
    url: baseUrl,
    siteName: "Devunpacker",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
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
