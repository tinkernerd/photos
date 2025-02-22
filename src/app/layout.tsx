import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TRPCProvider } from "@/trpc/client";

import { Readex_Pro } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import ScrollToTop from "@/components/scroll-to-top";

const readex = Readex_Pro({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s - StullStudios Photography",
    default: "StullStudios Photography",
  },
  description: "StullStudios Photography",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${readex.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <TRPCProvider>{children}</TRPCProvider>
          </QueryProvider>
          <Toaster />
          <TailwindIndicator />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
