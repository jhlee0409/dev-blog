import { BlogPosts } from "app/components/posts";
import { TagIcon } from "lucide-react";
import { capitalizeFirstLetter } from "src/shared/utils/string";

export const metadata = {
  title: "Blog",
  description: "Read my all blog posts.",
};

type Props = {
  searchParams: {
    tag: string;
  };
};

export default function Page({ searchParams }: Props) {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter flex items-center gap-2">
        All Posts
        {searchParams.tag && (
          <span className="flex items-center gap-2 text-neutral-400 text-xl ml-2">
            <TagIcon className="size-5" />
            {capitalizeFirstLetter(searchParams.tag)}
          </span>
        )}
      </h1>
      <BlogPosts viewAll tag={searchParams.tag} />
    </section>
  );
}
