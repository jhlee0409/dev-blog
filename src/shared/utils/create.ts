import { createElement } from "react";
import { slugify } from "./string";

export function createHeading(level: number) {
  return ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(children);

    if (!slug) {
      return;
    }

    return createElement(
      `h${level}`,
      { id: slug, className: "group relative" },
      [
        createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className:
            "anchor absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300",
          "aria-label": `Link to ${children}`,
          children: "#",
        }),
        children,
      ]
    );
  };
}
