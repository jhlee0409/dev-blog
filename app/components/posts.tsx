import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { BlurFade, SparklesText } from "src/shared/ui";
import { capitalizeFirstLetter } from "src/shared/utils/string";

type Props = {
  viewAll?: boolean;
  tag?: string;
};

const isNewPost = (date: string) => {
  const postDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - postDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

export function BlogPosts({ viewAll, tag }: Props) {
  const allBlogs = getBlogPosts();

  const sortedByDate = allBlogs.sort((a, b) => {
    const dateA = new Date(a.metadata.updatedAt || a.metadata.publishedAt);
    const dateB = new Date(b.metadata.updatedAt || b.metadata.publishedAt);
    return dateB.getTime() - dateA.getTime();
  });

  const filterByTag = (tag?: string) => {
    return tag
      ? sortedByDate.filter((post) => post.metadata.tags?.includes(tag))
      : sortedByDate;
  };

  return (
    <div className="space-y-2">
      {filterByTag(tag)
        .slice(0, viewAll ? undefined : 5)
        .map((post, idx) => (
          <BlurFade delay={(idx / 2) * 0.05} inView key={post.slug}>
            <Link
              className="block blog-post-link group"
              href={`/blog/${post.slug}`}
            >
              <div className="w-full">
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
                  <time className="text-neutral-500 dark:text-neutral-400 w-full md:w-32 md:flex-shrink-0 tabular-nums tracking-tight text-sm font-medium">
                    {formatDate(
                      post.metadata.updatedAt || post.metadata.publishedAt,
                      false
                    )}
                  </time>
                  <div className="flex-1 ml-0">
                    <h3 className="text-neutral-900 dark:text-neutral-100 tracking-tight font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {post.metadata.title}
                      {post.metadata.updatedAt &&
                        isNewPost(post.metadata.updatedAt) && (
                          <SparklesText
                            className="text-green-600 dark:text-green-400 pl-2 text-xs inline"
                            sparklesCount={6}
                            text="• Updated"
                          />
                        )}
                      {isNewPost(post.metadata.publishedAt) && (
                        <SparklesText
                          className="text-blue-600 dark:text-blue-400 pl-2 text-xs inline"
                          sparklesCount={6}
                          text="• NEW"
                        />
                      )}
                    </h3>
                  </div>
                </div>
                {tag && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.metadata.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-neutral-600 dark:text-neutral-400 text-xs inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md font-medium"
                      >
                        #{capitalizeFirstLetter(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </BlurFade>
        ))}
    </div>
  );
}
