// lib/analytics.ts

import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const propertyId = process.env.NEXT_PUBLIC_GA_ID;

// ✅ [수정] 특정 기간의 방문자 수를 가져오는 단일 함수
async function getReport(startDate: string, endDate: string) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: "activeUsers" }],
  });

  return response.rows?.[0]?.metricValues?.[0]?.value || "0";
}

export async function getVisitorData() {
  try {
    const [today, yesterday, total] = await Promise.all([
      getReport("today", "today"),
      getReport("yesterday", "yesterday"),
      getReport("2020-01-01", "today"),
    ]);

    return { today, yesterday, total };
  } catch (error) {
    console.error("GA Data API Error:", error);
    // 오류가 발생했을 때 반환할 값
    return { today: "N/A", yesterday: "N/A", total: "N/A" };
  }
}
