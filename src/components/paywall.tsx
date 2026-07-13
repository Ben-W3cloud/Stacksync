"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UpgradeButton } from "@/components/upgrade-button";

export function Paywall({ lessonTitle, courseTitle }: { lessonTitle: string; courseTitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">{lessonTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Part of <span className="font-semibold text-foreground">{courseTitle}</span> — a Pro
          track.
        </p>
        <p className="mt-4 text-muted-foreground">
          Upgrade to StackSync Pro to unlock this lesson and every premium course on the platform.
        </p>
        <UpgradeButton size="lg" variant="secondary" className="mt-6" />
      </Card>
    </motion.div>
  );
}
