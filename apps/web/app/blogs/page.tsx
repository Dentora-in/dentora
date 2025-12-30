import type { Metadata } from "next";
import { PublicHeader } from "@/components/layouts/public-header";
import { Footer } from "@/components/layouts/landing-page/childs/footer";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { BlogCard } from "@/components/blog/blog-card";
import { getBlogPosts, getFeaturedPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Expert insights, tips, and guides on dental health, oral care, and the future of dentistry.",
};

export default function BlogsPage() {
  const allPosts = getBlogPosts();
  const featuredPosts = getFeaturedPosts();
  const regularPosts = allPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <SectionWrapper className="pt-20 md:pt-28">
          <PageHeader
            badge="Insights & Resources"
            title="Dental Health Blog"
            description="Stay informed with expert articles on oral care, dental technology, and maintaining a healthy smile."
          />

          {/* Featured Articles Section */}
          {featuredPosts.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-foreground">
                  Featured Articles
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    author={post.author}
                    date={post.date}
                    category={post.category}
                    readTime={post.readTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Articles Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                All Articles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author}
                  date={post.date}
                  category={post.category}
                  readTime={post.readTime}
                />
              ))}
            </div>
          </div>

          {/* Empty State (if no posts) */}
          {allPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No blog posts available yet. Check back soon!
              </p>
            </div>
          )}
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}
