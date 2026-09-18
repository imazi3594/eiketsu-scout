import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ScoutApp } from "@/components/scout-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-bg text-sm text-muted">載入中…</div>;
  }
  return <ScoutApp />;
}
