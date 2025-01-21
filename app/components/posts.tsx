import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

type Props = {
  viewAll?: boolean;
};

export function BlogPosts({ viewAll }: Props) {
  const allBlogs = getBlogPosts();

  const sortedByDate = allBlogs.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <div>
      {sortedByDate.slice(0, viewAll ? undefined : 5).map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col space-y-1 mb-4 blog-post-link"
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-600 dark:text-neutral-400 w-fit-content tabular-nums tracking-tight ">
              {formatDate(post.metadata.publishedAt, false)}
            </p>
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
              {post.metadata.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
