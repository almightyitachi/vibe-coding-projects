import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "@/components/theme/ThemeProvider";
import { UIStoreProvider } from "@/hooks/useUIStore";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { QuickCreate } from "@/components/shell/QuickCreate";

export const metadata: Metadata = {
  title: "SprintDesk — Design Operating System",
  description: "Linear for designers. Sprints, tasks, documentation, reviews and roadmap in one keyboard-first workspace.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0e" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <UIStoreProvider>
            {children}
            <CommandPalette />
            <QuickCreate />
          </UIStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
