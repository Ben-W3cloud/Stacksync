"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

type SkillDatum = { domain: string; value: number };

export function SkillWebChart({ data }: { data: SkillDatum[] }) {
  return (
    <Card className="h-72 w-full p-5">
      <h3 className="mb-3 font-bold text-foreground">Skill Web</h3>
      {data.length ? (
        <ResponsiveContainer width="100%" height="85%">
          <RadarChart data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="domain" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Radar dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-muted-foreground">Complete lessons to build your skill web.</p>
      )}
    </Card>
  );
}
