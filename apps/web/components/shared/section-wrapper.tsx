import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "muted";
}

export function SectionWrapper({
  children,
  className = "",
  variant = "default",
}: SectionWrapperProps) {
  const bgClass = variant === "muted" ? "bg-muted/20" : "bg-background";

  return (
    <section className={`w-full py-16 md:py-24 px-6 ${bgClass} ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
