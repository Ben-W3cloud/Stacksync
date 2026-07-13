"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type LessonNode = {
  title: string;
  slug: string;
  status: "locked" | "in-progress" | "complete";
};

const NODE_STYLES: Record<LessonNode["status"], string> = {
  locked: "border-border bg-muted text-muted-foreground",
  "in-progress": "border-primary bg-primary text-primary-foreground shadow-[0_4px_0_0_theme(colors.cyan.700)]",
  complete: "border-success bg-success text-success-foreground shadow-[0_4px_0_0_theme(colors.emerald.700)]",
};

export function LearningPath({
  courseSlug,
  lessons,
}: {
  courseSlug: string;
  lessons: LessonNode[];
}) {
  return (
    <div className="relative space-y-3 py-2">
      {lessons.map((lesson, index) => {
        const offset = index % 2 === 0 ? "sm:translate-x-0" : "sm:translate-x-16";
        const NodeIcon = lesson.status === "complete" ? Check : lesson.status === "locked" ? Lock : Play;
        const isLocked = lesson.status === "locked";

        const content = (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.05 }}
            whileHover={isLocked ? undefined : { scale: 1.03 }}
            whileTap={isLocked ? undefined : { scale: 0.97 }}
            className={cn("flex items-center gap-4 sm:justify-start", offset)}
          >
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-bold transition",
                NODE_STYLES[lesson.status],
              )}
            >
              <NodeIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Lesson {index + 1}
              </div>
              <div
                className={cn(
                  "font-semibold",
                  isLocked ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {lesson.title}
              </div>
            </div>
          </motion.div>
        );

        return isLocked ? (
          <div key={lesson.slug} aria-disabled className="cursor-not-allowed">
            {content}
          </div>
        ) : (
          <Link key={lesson.slug} href={`/learn/${courseSlug}/${lesson.slug}`} className="block">
            {content}
          </Link>
        );
      })}
    </div>
  );
}
