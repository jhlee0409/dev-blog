import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import Image from "next/image";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Giscus from "app/components/Giscus";

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params?.slug);
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
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

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

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            keywords: post.metadata.tags?.join(", "),
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "My Blog",
            },
          }),
        }}
      />
      <Link href="/blog">
        <div className="hover:bg-neutral-800/10 dark:hover:bg-neutral-100/20 rounded-full p-2 w-fit mb-2 -ml-2">
          <ArrowLeftIcon />
        </div>
      </Link>

      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>

      <div className="flex flex-col justify-between mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
        {post.metadata.updatedAt && (
          <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-1">
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
                #{tag}
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
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
      <div className="w-full h-0.5 bg-black dark:bg-white" />
      <Giscus
        repo="jhlee0409/dev-blog"
        repoId="R_kgDONr9TmQ"
        category="Announcements"
        categoryId="DIC_kwDONr9Tmc4CmW3V"
      />
      <div className="w-full h-0.5 bg-black dark:bg-white" />
    </section>
  );
}
