import { notFound } from "next/navigation";
import { formatDate, getBlogPosts } from "@/app/blog/utils";
import { baseUrl } from "@/app/sitemap";
import Image from "next/image";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Giscus from "@/app/components/Giscus";
import { capitalizeFirstLetter } from "@/src/shared/utils/string";
import { TableOfContents } from "@/src/components/TableOfContents";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const { default: Post } = await import(`@/src/contents/${slug}.mdx`);

  return (
    <div className="relative">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6927905151492991"
        crossOrigin="anonymous"
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.updatedAt || post.metadata.publishedAt,
            description: post.metadata.summary,
            keywords: post.metadata.tags?.join(", "),
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/api/og?title=${encodeURIComponent(
                  post.metadata.title
                )}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Jack",
            },
          }),
        }}
      />

      <div className="flex gap-8">
        {/* 메인 콘텐츠 */}
        <section className="flex-1 min-w-0">
          <Link href="/blog">
            <div className="back-button hover:bg-neutral-800/10 dark:hover:bg-neutral-100/20 rounded-full p-2 w-fit mb-2 -ml-2">
              <ArrowLeftIcon />
            </div>
          </Link>

          <h1 className="title font-semibold !text-2xl tracking-tighter !m-0">
            {post.metadata.title}
          </h1>

          <div className="flex flex-col justify-between mt-2 mb-8 text-sm">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 !m-0">
              {formatDate(post.metadata.publishedAt)}
            </p>
            {post.metadata.updatedAt && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-1 !m-0">
                Updated on {formatDate(post.metadata.updatedAt)}
              </p>
            )}
            <div>
              <div
                className="flex flex-wrap gap-2 my-4"
                itemScope
                itemType="https://schema.org/Article"
              >
                {post.metadata.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                    itemProp="keywords"
                  >
                    #{capitalizeFirstLetter(tag)}
                  </span>
                ))}
              </div>
              {!!post.metadata.image && (
                <Image
                  className="w-full"
                  src={post.metadata.image}
                  alt={post.metadata.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              )}
            </div>
          </div>

          {/* 모바일 목차 */}
          <div className="lg:hidden mb-8">
            <TableOfContents collapsible />
          </div>

          <article className="prose">
            <Post />
          </article>

          <div className="mt-10 w-full h-0.5 bg-black dark:bg-white" />
          <Giscus
            repo="jhlee0409/dev-blog"
            repoId="R_kgDONr9TmQ"
            category="Announcements"
            categoryId="DIC_kwDONr9Tmc4CmW3V"
          />
          <div className="mt-2 w-full h-0.5 bg-black dark:bg-white" />
        </section>

        {/* 데스크톱 사이드바 목차 */}
        <aside className="mt-10 hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
    tags,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/api/og?title=${encodeURIComponent(
        title
      )}&description=${encodeURIComponent(description || "")}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    keywords: tags?.join(", "),
  };
}

export function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
    metadata: post.metadata,
  }));
}

export const dynamicParams = false;
