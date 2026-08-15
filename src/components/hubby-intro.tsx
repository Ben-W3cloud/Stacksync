"use client";

import { useState } from "react";
import { HubbyModal } from "@/components/hubby-modal";

export function HubbyIntro({ initialOpen }: { initialOpen: boolean }) {
  const [open, setOpen] = useState(initialOpen);

  function close() {
    setOpen(false);
    void fetch("/api/hubby/seen", { method: "POST" });
  }

  return <HubbyModal open={open} onClose={close} variant="intro" />;
}
