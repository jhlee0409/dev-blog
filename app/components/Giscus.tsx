"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export default function Giscus({
  repo,
  repoId,
  category,
  categoryId,
}: GiscusProps) {
  const { resolvedTheme } = useTheme();
  const commentRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const getTheme = () => {
    if (resolvedTheme) return resolvedTheme === "dark" ? "dark" : "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // 스크립트 생성 및 관리
  useEffect(() => {
    if (!commentRef.current || scriptRef.current) return;

    const script = document.createElement("script");
    Object.entries({
      src: "https://giscus.app/client.js",
      "data-repo": repo,
      "data-repo-id": repoId,
      "data-category": category,
      "data-category-id": categoryId,
      "data-mapping": "pathname",
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "bottom",
      "data-theme": getTheme(),
      "data-lang": "ko",
      "data-loading": "lazy",
      crossorigin: "anonymous",
      async: "true",
    }).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    commentRef.current.appendChild(script);
    scriptRef.current = script;

    // cleanup
    return () => {
      script.remove();
      scriptRef.current = null;
    };
  }, [repo, repoId, category, categoryId, resolvedTheme]);

  // 테마 변경 처리
  useEffect(() => {
    try {
      const iframe = document.querySelector<HTMLIFrameElement>(
        "iframe.giscus-frame"
      );

      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: getTheme(),
              },
            },
          },
          "https://giscus.app"
        );
      }
    } catch (error) {
      console.error("Failed to update Giscus theme:", error);
    }
  }, [resolvedTheme]);

  return <div ref={commentRef} className="my-10" />;
}
