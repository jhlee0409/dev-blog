import { BlogPosts } from "app/components/posts";
import { TagIcon } from "lucide-react";
import { capitalizeFirstLetter } from "src/shared/utils/string";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const tag = searchParams.tag as string;

  return {
    title: `Blog${tag ? ` | ${capitalizeFirstLetter(tag)}` : ""}`,
    description: `Read my all blog posts${
      tag ? ` in ${capitalizeFirstLetter(tag)}` : ""
    }.`,
  };
}

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const tag = searchParams.tag as string;

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter flex items-center gap-2">
        All Posts
        {tag && (
          <span className="flex items-center gap-2 text-neutral-400 text-xl ml-2">
            <TagIcon className="size-5" />
            {capitalizeFirstLetter(tag)}
          </span>
        )}
      </h1>
      <BlogPosts viewAll tag={tag} />
    </section>
  );
}
