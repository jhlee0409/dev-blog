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
      { id: slug },
      [
        createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };
}
