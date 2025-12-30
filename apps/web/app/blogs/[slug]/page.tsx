import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicHeader } from "@/components/layouts/public-header";
import { Footer } from "@/components/layouts/landing-page/childs/footer";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { getBlogPost, getBlogPosts } from "@/lib/blog-data";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <SectionWrapper className="pt-20 md:pt-28">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/blogs">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <article className="max-w-3xl mx-auto">
            <header className="mb-12">
              {/* Category Badge */}
              <div className="mb-4">
                <Badge variant="secondary" className="text-sm">
                  {post.category}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <Separator className="mt-8" />
            </header>

            {/* Article Content */}
            <div className="prose prose-neutral max-w-none">
              <div
                className="prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-muted-foreground prose-ul:my-6 prose-li:my-2 prose-strong:text-foreground"
                style={{ whiteSpace: "pre-line" }}
              >
                {post.content}
              </div>
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Written by
                  </p>
                  <p className="font-semibold text-foreground">{post.author}</p>
                </div>
                <Button asChild>
                  <Link href="/blogs">View All Articles</Link>
                </Button>
              </div>
            </footer>
          </article>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}
