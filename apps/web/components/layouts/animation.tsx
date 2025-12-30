import React from "react";

export function AnimatedBackground({
  variant = "default",
}: {
  variant?: "default" | "hero" | "cta";
}) {
  if (variant === "hero") {
    return (
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-white">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Gradient orbs - very subtle */}
        <div className="absolute inset-0">
          {/* Soft teal/cyan blob - top right */}
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "slow-drift 35s ease-in-out infinite",
            }}
          />

          {/* Soft purple blob - left side */}
          <div
            className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
              filter: "blur(70px)",
              animation: "slow-drift 40s ease-in-out infinite reverse",
              animationDelay: "5s",
            }}
          />

          {/* Soft green accent - bottom */}
          <div
            className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
              filter: "blur(80px)",
              animation: "slow-drift 45s ease-in-out infinite",
              animationDelay: "10s",
            }}
          />
        </div>
      </div>
    );
  }

  if (variant === "cta") {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.02) 50%, rgba(16, 185, 129, 0.03) 100%)",
          }}
        />

        {/* Single subtle orb */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "gradient-shift 25s ease-in-out infinite",
          }}
        />
      </div>
    );
  }

  // Default - minimal or none
  return null;
}
