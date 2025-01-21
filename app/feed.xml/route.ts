import { getBlogPosts } from "../blog/utils";
import RSS from "rss";

export async function GET() {
  const feed = new RSS({
    title: "DevUnpacker",
    description: "Frontend Developer Blog",
    site_url: "https://www.devunpacker.com",
    feed_url: "https://www.devunpacker.com/feed.xml",
    language: "ko",
    pubDate: new Date(),
  });

  const allBlogs = getBlogPosts();

  allBlogs.forEach((post) => {
    feed.item({
      title: post.metadata.title,
      url: `https://www.devunpacker.com/blog/${post.slug}`,
      date: post.metadata.publishedAt,
      description: post.metadata.summary,
      author: "Jack Lee",
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
      "x-content-type-options": "nosniff",
    },
  });
}
