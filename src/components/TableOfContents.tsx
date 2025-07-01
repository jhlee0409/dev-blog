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

    const headings = article.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
    );
    const items: TocItem[] = Array.from(headings)
      .map((heading) => {
        const text = heading.textContent?.replace("#", "").trim() || "";
        return {
          id: heading.id,
          text,
          level: parseInt(heading.tagName[1]),
        };
      })
      .filter((item) => item.text && item.id); // 텍스트와 ID가 모두 있는 것만 포함

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
        "p-3 border border-neutral-200 dark:border-neutral-800 rounded-md flex flex-col",
        className
      )}
    >
      <div
        className={cn("flex items-center justify-between", {
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
          "transition-all duration-300 ease-in-out overflow-hidden",
          {
            "max-h-0 opacity-0": !isExpanded,
            "max-h-screen opacity-100": isExpanded,
          }
        )}
      >
        <ul className="!list-none space-y-0.5 mt-2 !p-0">
          {tocItems.map((item, index) => (
            <li key={`${item.id}-${index}`} className="!m-0 cursor-pointer">
              <button
                onClick={() => handleClick(item.id)}
                className={cn(
                  "text-left w-full py-1.5 px-2 rounded transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs leading-relaxed flex items-center gap-1",
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
