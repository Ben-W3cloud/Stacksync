"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const data = (await response.json().catch(() => null)) as { url?: string } | null;
    if (data?.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={openPortal}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-full border-2 border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary disabled:opacity-40"
    >
      <CreditCard className="h-4 w-4" />
      {loading ? "Opening..." : "Manage billing"}
    </button>
  );
}
