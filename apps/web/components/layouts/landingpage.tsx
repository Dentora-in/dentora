"use client";

import { Button } from "@workspace/ui/components/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function Landingpage() {
    const route = useRouter();
    const { theme, setTheme } = useTheme();
    return (
        <>
            <div className="flex items-center justify-center min-h-svh">
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-9xl font-extrabold">DENTORA BABY</h1>
                    <h1 className="text-2xl font-bold">For users</h1>
                    <div className="flex gap-2">
                        <Button className="hover:cursor-pointer" size="sm" onClick={() => setTheme(theme === "white" ? "dark" : "white")}>Theme</Button>
                        <Button className="hover:cursor-pointer" size="sm" onClick={() => route.push("/user/login")}>Log In</Button>
                        <Button className="hover:cursor-pointer" size="sm" onClick={() => route.push("/user/signup")}>Sign Up</Button>
                    </div>
                </div>
            </div>
        </>
    )
}