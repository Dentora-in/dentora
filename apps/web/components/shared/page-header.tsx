import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      {badge && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-1.5 text-sm border border-border/40 backdrop-blur-sm">
          <span className="text-muted-foreground font-medium">{badge}</span>
        </div>
      )}
      <h1 className="text-balance text-4xl md:text-5xl font-bold mb-5 text-foreground tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
