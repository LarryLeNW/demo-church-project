"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        {children}
        <ScrollToTop />
      </AuthProvider>
    </LanguageProvider>
  );
}
