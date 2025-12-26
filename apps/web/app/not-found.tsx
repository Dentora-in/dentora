"use client";

import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      {/* Preload the Lottie JSON file for instant rendering */}
      <link
        rel="preload"
        href="/404Luna.json"
        as="fetch"
        crossOrigin="anonymous"
      />

      <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center gap-6 sm:gap-8">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight animate-fade-up">
          Oops! <span className="text-primary">Page Not Found</span>
        </h1>

        <p className="max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground animate-fade-up delay-100">
          The page you're trying to reach has floated away into space. Maybe it
          never existed — or maybe it's exploring new galaxies. Let's get you
          back on track.
        </p>

        <div className="w-full max-w-2xl animate-fade-up delay-200">
          <Player
            autoplay
            loop
            src="/404Luna.json"
            className="w-full h-[280px] sm:h-[380px]"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 animate-fade-up delay-300 w-full sm:w-auto">
          <Button
            variant="outline"
            className="gap-2 px-5 py-5 sm:px-6 sm:py-6 rounded-xl text-sm sm:text-base font-medium hover:cursor-pointer w-full sm:w-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} /> Go Back
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button className="px-5 py-5 sm:px-6 sm:py-6 rounded-xl text-sm sm:text-base font-semibold hover:cursor-pointer w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}
