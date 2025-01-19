import { BlogPosts } from "app/components/posts";

export const metadata = {
  title: "All Posts",
  description: "Read my all blog posts.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        All Posts
      </h1>
      <BlogPosts />
    </section>
  );
}
