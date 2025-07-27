import { BetaAnalyticsDataClient } from "@google-analytics/data";

let serviceAccount: any = {};
try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    let jsonString = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    // private_key 내의 실제 줄바꿈을 보존하면서 JSON 파싱
    // 정규식으로 private_key 필드를 찾아서 내부의 줄바꿈을 이스케이프
    const privateKeyRegex = /("private_key"\s*:\s*")([\s\S]*?)(")/g;
    jsonString = jsonString.replace(privateKeyRegex, (match, p1, p2, p3) => {
      // private_key 내부의 실제 줄바꿈을 \n으로 변환
      const escapedKey = p2.replace(/\n/g, "\\n");
      return p1 + escapedKey + p3;
    });

    serviceAccount = JSON.parse(jsonString);
  }
} catch (error) {
  console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", error);
  console.error(
    "JSON string preview:",
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.substring(0, 200)
  );
  serviceAccount = {};
}

const analyticsDataClient =
  serviceAccount.client_email && serviceAccount.private_key
    ? new BetaAnalyticsDataClient({
        credentials: {
          client_email: serviceAccount.client_email,
          private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
        },
      })
    : null;

const propertyId = process.env.NEXT_PUBLIC_GA_ID;

async function getReport(startDate: string, endDate: string) {
  if (!analyticsDataClient) {
    return "0";
  }

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: "activeUsers" }],
  });

  const value = response.rows?.[0]?.metricValues?.[0]?.value || "0";

  return value;
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
    // 오류가 발생했을 때 반환할 값
    return { today: "N/A", yesterday: "N/A", total: "N/A" };
  }
}
