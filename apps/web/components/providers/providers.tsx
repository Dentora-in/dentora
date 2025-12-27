"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "./session-provider";
import { ProvidersProps } from "@/interfaces/provider.interface";

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </SessionProvider>
  );
}
