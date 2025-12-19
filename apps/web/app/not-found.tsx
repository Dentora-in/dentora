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
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight animate-fade-up">
        Oops! <span className="text-primary">Page Not Found</span>
      </h1>

      <p className="max-w-2xl text-lg text-muted-foreground animate-fade-up delay-100">
        The page you’re trying to reach has floated away into space. Maybe it
        never existed — or maybe it’s exploring new galaxies. Let’s get you back
        on track.
      </p>

      <div className="w-full max-w-2xl animate-fade-up delay-200">
        <Player
          autoplay
          loop
          src="/404Luna.json"
          className="w-full h-[380px]"
        />
      </div>

      <div className="flex items-center gap-4 animate-fade-up delay-300">
        <Button
          variant="outline"
          className="gap-2 px-6 py-6 rounded-xl text-base font-medium hover:cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} /> Go Back
        </Button>

        <Link href="/">
          <Button className="px-6 py-6 rounded-xl text-base font-semibold hover:cursor-pointer">
            Return Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
