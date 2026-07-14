"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = { title: string; activeLearners: number; isPremium: boolean };

export function AdminCourseChart({ data }: { data: Datum[] }) {
  if (!data.length) {
    return <p className="text-sm text-muted-foreground">No course activity yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis dataKey="title" tick={{ fontSize: 12 }} interval={0} angle={-12} textAnchor="end" height={60} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }}
          cursor={{ fill: "currentColor", opacity: 0.05 }}
        />
        <Bar dataKey="activeLearners" name="Active learners" radius={[8, 8, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.title} fill={entry.isPremium ? "#a78bfa" : "#06b6d4"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
