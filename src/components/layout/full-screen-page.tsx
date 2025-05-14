import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export function FullScreenPage({
  children,
  className,
  inApp,
}: PropsWithChildren<{ className?: string; inApp?: boolean }>) {
  return (
    <main
      className={cn(
        "w-full min-h-screen h-full",
        inApp && "grid grid-rows-[1fr_auto]",
        className,
      )}
    >
      {children}
    </main>
  );
}
