"use client";

import { useEffect, useState } from "react";

export default function AnalyticsStatus() {
  const [visitorData, setVisitorData] = useState({
    today: "0",
    yesterday: "0",
    total: "0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        setVisitorData(data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { label: "Today", value: visitorData.today },
    { label: "Yesterday", value: visitorData.yesterday },
  ];

  if (loading) {
    return (
      <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-md flex flex-col gap-1 w-[104px] h-[104px]">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded mb-1"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-md flex flex-col gap-1">
      <div className="flex flex-col gap-0.5">
        <div className="text-neutral-500 dark:text-neutral-500 text-xs">
          전체 방문자
        </div>
        <div className="font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">
          {Intl.NumberFormat("ko-KR").format(Number(visitorData.total))}
        </div>
      </div>
      <div className="flex flex-col justify-between text-sm">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center flex gap-1">
            <div className="text-neutral-500 dark:text-neutral-500 text-xs">
              {`${stat.label} :`}
            </div>
            <div className="font-medium text-neutral-900 dark:text-neutral-100 tabular-nums leading-none">
              {Intl.NumberFormat("ko-KR").format(Number(stat.value))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
