import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category?: string;
  readTime?: string;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  author,
  date,
  category,
  readTime,
}: BlogCardProps) {
  return (
    <Card className="group border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full">
      <CardHeader className="flex-1">
        {category && (
          <Badge variant="secondary" className="w-fit mb-3">
            {category}
          </Badge>
        )}
        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-muted-foreground leading-relaxed">
          {excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          {readTime && <span>{readTime}</span>}
        </div>
      </CardContent>

      <CardFooter>
        <Link
          href={`/blogs/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all group/link"
        >
          Read Article
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}
