import "./global.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./components/footer";
import { baseUrl } from "./sitemap";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "devunpacker",
    template: "%s | devunpacker",
  },
  description: "This is my technical blog.",
  openGraph: {
    title: "My Technical Blog",
    description: "This is my technical blog.",
    url: baseUrl,
    siteName: "My Technical Blog",
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
      <body
        className={cx(
          GeistSans.variable,
          GeistMono.variable,
          "antialiased min-h-screen"
        )}
      >
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
