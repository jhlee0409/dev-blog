import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import { ImageGallery } from "./ImageGallery";
import { Badge } from "./Badge";

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

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

function RoundedImage(props) {
  return (
    <div className="w-full">
      <Image
        alt={props.alt}
        className="rounded-lg w-full h-auto"
        {...props}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import darcula from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";

function Code({ children, ...props }) {
  // className이 없으면 인라인 코드로 처리
  if (!props.className) {
    // Badge로 처리할 특수 문자열 체크
    if (typeof children === "string") {
      return <Badge>{children}</Badge>;
    }
    // 일반 인라인 코드
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

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  ImageGallery: ImageGallery,
  pre: Code,
  code: Code,
  Table,
};

export async function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
