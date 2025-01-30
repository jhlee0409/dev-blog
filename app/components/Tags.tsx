"use client";

import Link from "next/link";
import { capitalizeFirstLetter } from "src/shared/utils/string";

type Props = {
  tags: (string | undefined)[];
};
export const Tags = ({ tags }: Props) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {tags.map(
        (tag) =>
          tag && (
            <Link href={`/blog?tag=${tag}`} key={tag}>
              <div className="text-neutral-700 dark:text-neutral-300 text-xs inline-block bg-neutral-100 dark:bg-neutral-800 py-1 px-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">
                #{capitalizeFirstLetter(tag)}
              </div>
            </Link>
          )
      )}
    </div>
  );
};
