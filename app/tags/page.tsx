import { getBlogPosts } from "app/blog/utils";
import { Tags } from "app/components/Tags";

export default function TagPage() {
  const posts = getBlogPosts();
  const tags = posts.map((post) => post.metadata.tags);
  const uniqueTags = Array.from(new Set(tags.flat()));
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Tags</h1>
      <Tags tags={uniqueTags} />
    </section>
  );
}
