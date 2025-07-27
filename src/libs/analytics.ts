import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { safeDestr } from "destr";

let serviceAccount: any = {};
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    // destr로 안전하게 JSON 파싱
    const parsed = safeDestr(process.env.GOOGLE_SERVICE_ACCOUNT_JSON, {});
    
    if (parsed && typeof parsed === 'object' && (parsed as any).client_email && (parsed as any).private_key) {
      serviceAccount = parsed;
    } else {
      console.error("Invalid service account JSON: missing required fields or failed to parse");
      serviceAccount = {};
    }
  } catch (error) {
    console.error("Failed to parse service account JSON:", error);
    serviceAccount = {};
  }
} else {
  // 빌드 시간에는 경고를 출력하지 않음
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
    console.warn("GOOGLE_SERVICE_ACCOUNT_JSON environment variable not found");
  }
}

// Analytics 클라이언트를 다이내믹하게 생성
function createAnalyticsClient() {
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    return null;
  }
  
  try {
    return new BetaAnalyticsDataClient({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
    });
  } catch (error) {
    console.error("Failed to create analytics client:", error);
    return null;
  }
}

const propertyId = process.env.NEXT_PUBLIC_GA_ID;

async function getReport(startDate: string, endDate: string) {
  const analyticsDataClient = createAnalyticsClient();
  
  if (!analyticsDataClient) {
    console.warn("Analytics client not initialized - check GOOGLE_SERVICE_ACCOUNT_JSON env var");
    return "0";
  }
  
  if (!propertyId) {
    console.warn("GA Property ID not found - check NEXT_PUBLIC_GA_ID env var");
    return "0";
  }

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: "activeUsers" }],
    });

    const value = response.rows?.[0]?.metricValues?.[0]?.value || "0";

    return value;
  } catch (error: any) {
    console.error("GA runReport error:", error.message);
    if (error.details) {
      console.error("Error details:", error.details);
    }
    return "0";
  }
}

// 캐시를 위한 변수
let cachedData: { today: string; yesterday: string; total: string } | null =
  null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

// 날짜를 YYYY-MM-DD 형식으로 변환하는 헬퍼 함수
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getVisitorData() {
  // 캐시된 데이터가 있고 유효한 경우 반환
  const now = Date.now();
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return cachedData;
  }

  try {
    // 한국 시간대 기준으로 날짜 계산 (더 안정적인 방법)
    const currentDate = new Date();
    const kstOffset = 9 * 60; // KST는 UTC+9
    const utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
    const kstTime = new Date(utc + kstOffset * 60000);

    const todayKST = new Date(
      kstTime.getFullYear(),
      kstTime.getMonth(),
      kstTime.getDate()
    );
    const yesterdayKST = new Date(todayKST);
    yesterdayKST.setDate(yesterdayKST.getDate() - 1);

    const todayStr = formatDate(todayKST);
    const yesterdayStr = formatDate(yesterdayKST);

    const [today, yesterday, total] = await Promise.all([
      getReport(todayStr, todayStr),
      getReport(yesterdayStr, yesterdayStr),
      getReport("2020-01-01", todayStr),
    ]);

    // 데이터 캐싱
    cachedData = { today, yesterday, total };
    lastFetchTime = now;

    return cachedData;
  } catch (error) {
    console.error("GA Data API Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    // 오류가 발생했을 때 반환할 값
    return { today: "N/A", yesterday: "N/A", total: "N/A" };
  }
}
