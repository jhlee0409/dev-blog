"use client";

import { Clipboard } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import darcula from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import { Badge } from "src/mdx-components/Badge";

export function Code({ children, ...props }) {
  if (!props.className) {
    if (typeof children === "string") {
      return <Badge>{children}</Badge>;
    }
    return <code>{children}</code>;
  }

  const language = props.className?.replace(/language-/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(children as string);
  };

  return (
    <div className="code-container rounded-md overflow-hidden my-8">
      <div className="flex justify-between bg-[rgb(40,_44,_52)] px-4 pt-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#f45f57] w-2.5 h-2.5 rounded-full" />
          <div className="bg-[#f8bc2f] w-2.5 h-2.5 rounded-full" />
          <div className="bg-[#28c841] w-2.5 h-2.5 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 text-neutral-400 cursor-pointer hover:text-neutral-200 hover:bg-neutral-800/50 rounded-md p-1"
            onClick={handleCopy}
          >
            <Clipboard className="w-4 h-4" />
            <span className="text-xs font-mono">{language}</span>
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={darcula}
        customStyle={{
          margin: 0,
          padding: "1.5rem 1rem",
          background: "rgb(40, 44, 52)",
          borderRadius: "0",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
