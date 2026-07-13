"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

export function UpgradeButton(props: ButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upgrade() {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

    if (!response.ok || !data?.url) {
      setError(data?.error ?? "Could not start checkout");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div>
      <Button onClick={upgrade} disabled={loading} {...props}>
        <Sparkles className="h-5 w-5" />
        {loading ? "Redirecting..." : "Upgrade to Pro"}
      </Button>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
