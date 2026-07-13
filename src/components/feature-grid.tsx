"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export type Feature = { icon: LucideIcon; title: string; body: string };

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: index * 0.08 }}
        >
          <Card className="h-full p-6">
            <feature.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-bold text-foreground">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{feature.body}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
