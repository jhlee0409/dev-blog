import { getVisitorData } from "@/src/libs/analytics";

export default async function AnalyticsStatus() {
  const visitorData = await getVisitorData();

  const stats = [
    { label: "Today", value: visitorData.today },
    { label: "Yesterday", value: visitorData.yesterday },
  ];

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
