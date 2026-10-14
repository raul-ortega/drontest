"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CustomSession } from "@/lib/auth";

interface SessionContextValue {
  data: CustomSession | null;
  status: "authenticated" | "unauthenticated" | "loading";
  updateSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "loading",
  updateSession: async () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomSession | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");

  const updateSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = (await res.json()) as CustomSession | null;
        setSession(data);
        setStatus(data ? "authenticated" : "unauthenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    } catch {
      setSession(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    updateSession();
  }, [updateSession]);

  return (
    <SessionContext.Provider value={{ data: session, status, updateSession }}>
      {children}
    </SessionContext.Provider>
  );
}
