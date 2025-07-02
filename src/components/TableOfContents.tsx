"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/shared/utils/cn";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
  collapsible?: boolean;
}

export function TableOfContents({
  className,
  collapsible = false,
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  useEffect(() => {
    const article = document.querySelector("article.prose");
    if (!article) return;

    const headings = article.querySelectorAll("h1, h2, h3, h4, h5, h6");

    const usedIds = new Set<string>();
    const items: TocItem[] = Array.from(headings)
      .map((heading, index) => {
        // 텍스트 추출 시 더 안전한 방법 사용
        let text = "";
        if (heading.textContent) {
          text = heading.textContent.replace(/#/g, "").trim();
        } else if (heading.textContent) {
          text = heading.textContent.replace(/#/g, "").trim();
        } else {
          console.warn("Invalid heading text detected:", heading, text);
          return null;
        }

        // 빈 텍스트나 잘못된 텍스트 필터링
        if (!text || text === "[object Object]" || text.includes("object")) {
          console.warn("Invalid heading text detected:", heading, text);
          return null;
        }

        // ID가 없거나 중복되는 경우 새로운 고유 ID 생성
        let id = heading.id;
        if (!id || id === "object-object" || usedIds.has(id)) {
          // 텍스트를 기반으로 slug 생성
          const baseSlug = text
            .toLowerCase()
            .replace(/[^a-z0-9가-힣\s]/g, "") // 특수문자 제거하되 공백은 유지
            .replace(/\s+/g, "-") // 공백을 하이픈으로
            .replace(/-+/g, "-") // 연속 하이픈 정리
            .replace(/^-|-$/g, ""); // 앞뒤 하이픈 제거

          id = baseSlug || `heading-${index}`; // baseSlug가 비어있으면 fallback
          let counter = 1;
          while (usedIds.has(id)) {
            id = `${baseSlug || `heading-${index}`}-${counter}`;
            counter++;
          }

          // 실제 DOM 요소에도 새로운 ID 설정
          heading.id = id;
        }

        usedIds.add(id);

        return {
          id,
          text,
          level: parseInt(heading.tagName[1]),
        };
      })
      .filter((item): item is TocItem => item !== null);

    setTocItems(items);

    // Intersection Observer로 현재 보고 있는 섹션 추적
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // CSS의 scroll-margin-top과 동일하게 설정
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        "border border-neutral-200 dark:border-neutral-800 rounded-md flex flex-col",
        className
      )}
    >
      <div
        className={cn("flex items-center justify-between p-3", {
          "cursor-pointer": collapsible,
        })}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="text-neutral-500 dark:text-neutral-500 text-xs">
          목차
        </div>
        {collapsible && (
          <button
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-500"
            aria-label={isExpanded ? "목차 접기" : "목차 펼치기"}
          >
            {isExpanded ? (
              <ChevronUpIcon size={14} />
            ) : (
              <ChevronDownIcon size={14} />
            )}
          </button>
        )}
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden px-1",
          {
            "max-h-0 opacity-0": !isExpanded,
            "max-h-[50dvh] overflow-y-auto opacity-100": isExpanded,
          }
        )}
      >
        <ul className="!list-none space-y-0.5 mt-2 !p-0">
          {tocItems.map((item, index) => (
            // 한줄처리
            <li key={`${item.id}-${index}`} className="!m-0">
              <button
                onClick={() => handleClick(item.id)}
                className={cn(
                  "cursor-pointer text-left w-full truncate py-1.5 px-2 rounded transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs leading-relaxed",
                  {
                    "text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 font-medium":
                      activeId === item.id,
                    "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200":
                      activeId !== item.id,
                  }
                )}
                style={{
                  paddingLeft: `${(item.level - 2) * 0.5 + 0.5}rem`,
                }}
              >
                {`${item.level > 2 ? "└" : ""}${
                  item.level > 2 ? "─".repeat(item.level - 3) : ""
                } ${item.text}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
