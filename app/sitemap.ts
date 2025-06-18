import { getBlogPosts } from "app/blog/utils";

export const baseUrl = "https://www.devunpacker.com";

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  let routes = ["", "/blog", "/tags"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: 'daily' as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes, ...blogs];
}
