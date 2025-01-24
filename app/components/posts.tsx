import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { BlurFade } from "src/shared/ui";

type Props = {
  viewAll?: boolean;
};

const isNewPost = (date: string) => {
  const postDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - postDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

export function BlogPosts({ viewAll }: Props) {
  const allBlogs = getBlogPosts();

  const sortedByDate = allBlogs.sort((a, b) => {
    const dateA = new Date(a.metadata.updatedAt || a.metadata.publishedAt);
    const dateB = new Date(b.metadata.updatedAt || b.metadata.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div>
      {sortedByDate.slice(0, viewAll ? undefined : 5).map((post, idx) => (
        <BlurFade delay={idx * 0.05} inView key={post.slug}>
          <Link
            className="flex flex-col space-y-1 mb-4 blog-post-link"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-fit-content tabular-nums tracking-tight">
                {formatDate(
                  post.metadata.updatedAt || post.metadata.publishedAt,
                  false
                )}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
                {post.metadata.updatedAt && (
                  <span className="text-green-600 dark:text-green-400 pl-2 text-xs">
                    • Updated
                  </span>
                )}
                {isNewPost(
                  post.metadata.updatedAt || post.metadata.publishedAt
                ) && (
                  <span className="text-blue-600 dark:text-blue-400 pl-2 text-xs">
                    • NEW
                  </span>
                )}
              </p>
            </div>
          </Link>
        </BlurFade>
      ))}
    </div>
  );
}
