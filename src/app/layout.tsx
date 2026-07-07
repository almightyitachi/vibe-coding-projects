import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "@/components/theme/ThemeProvider";
import { UIStoreProvider } from "@/hooks/useUIStore";
import { TasksProvider } from "@/hooks/useTaskStore";
import { WorkspaceProvider } from "@/hooks/useWorkspaceStore";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { QuickCreate } from "@/components/shell/QuickCreate";
import { SprintCreate } from "@/components/shell/SprintCreate";
import { DocCreate } from "@/components/shell/DocCreate";
import { TaskPanel } from "@/components/board/TaskPanel";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "SprintDesk — Design Operating System",
  description: "Linear for designers. Sprints, tasks, documentation, reviews and roadmap in one keyboard-first workspace.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#121613" },
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
            <TasksProvider>
              <WorkspaceProvider>
                {children}
                <CommandPalette />
                <QuickCreate />
                <SprintCreate />
                <DocCreate />
                <TaskPanel />
                <Toaster />
              </WorkspaceProvider>
            </TasksProvider>
          </UIStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
