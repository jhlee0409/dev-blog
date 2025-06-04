import { Badge } from "app/components/Badge";
import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto w-fit rounded-lg border border-gray-200 shadow-sm dark:border-neutral-700">
      <table {...props} className={cn(props.className)} />
    </div>
  );
}

const StyledThead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    {...props}
    className={cn(props.className, "bg-gray-50 dark:bg-neutral-800")}
  />
);

const StyledTbody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody
    {...props}
    className={cn(
      props.className,
      "divide-y divide-gray-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900"
    )}
  />
);

const StyledTr = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    {...props}
    className={cn(
      props.className,
      "border-b border-gray-200 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
    )}
  />
);

const StyledTh = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    {...props}
    className={cn(
      props.className,
      "border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 dark:border-neutral-600 dark:text-neutral-200"
    )}
  />
);

const StyledTd = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td
    {...props}
    className={cn(
      props.className,
      "px-4 whitespace-pre-wrap py-2 text-gray-700 dark:text-neutral-300"
    )}
  />
);

function CustomLink(props) {
  const href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props: ImageProps) {
  return (
    <Image
      {...props}
      alt={props.alt}
      className="rounded-lg w-full h-auto"
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
    />
  );
}

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import darcula from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import { ImageGallery } from "app/components/ImageGallery";
import { createElement } from "react";
import Link from "next/link";
import { cn } from "src/shared/utils";

export function Code({ children, ...props }) {
  if (!props.className) {
    if (typeof children === "string") {
      return <Badge>{children}</Badge>;
    }
    return <code>{children}</code>;
  }

  const language = props.className?.replace(/language-/, "");

  return (
    <div className="code-container rounded-md overflow-hidden my-4">
      <div className="flex justify-between bg-[rgb(40,_44,_52)] px-4 pt-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#f45f57] w-2.5 h-2.5 rounded-full" />
          <div className="bg-[#f8bc2f] w-2.5 h-2.5 rounded-full" />
          <div className="bg-[#28c841] w-2.5 h-2.5 rounded-full" />
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

function slugify(node: React.ReactNode) {
  const str = node?.toString();
  if (!str || str.includes("title")) {
    return null;
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^a-zㄱ-ㅎㅏ-ㅣ가-힣0-9-]/g, "");
}

function createHeading(level: number) {
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

const customComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: RoundedImage,
  a: CustomLink,
  ImageGallery: ImageGallery,
  pre: Code,
  code: Code,
  table: Table,
  thead: StyledThead,
  tbody: StyledTbody,
  tr: StyledTr,
  th: StyledTh,
  td: StyledTd,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components,
  };
}
