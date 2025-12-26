"use client";

import { createContext, useContext, useState } from "react";
import { ProvidersProps } from "@/interfaces/provider.interface";

const SessionContext = createContext<any>(null);

export function SessionProvider({ session, children }: ProvidersProps) {
  const [sessionValue] = useState(session);

  return (
    <SessionContext.Provider value={sessionValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useAuthSession() {
  return useContext(SessionContext);
}
