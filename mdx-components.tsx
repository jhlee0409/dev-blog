import type { MDXComponents } from "mdx/types";
import {
  Table,
  Code,
  CustomLink,
  ImageGallery,
  RoundedImage,
} from "src/mdx-components";
import { createHeading } from "src/shared/utils";

const customComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: RoundedImage,
  a: CustomLink,
  ImageGallery,
  pre: Code,
  code: Code,
  table: Table,
  thead: Table.Thead,
  tbody: Table.Tbody,
  tr: Table.Tr,
  th: Table.Th,
  td: Table.Td,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components,
  };
}
