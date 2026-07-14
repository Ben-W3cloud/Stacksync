import { notFound } from "next/navigation";
import { Crown, Users, UserCheck } from "lucide-react";
import { AdminCourseChart } from "@/components/admin-course-chart";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminMetrics, isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  accent: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={`h-5 w-5 ${accent}`} />
      </div>
      <div className="mt-2 text-3xl font-extrabold text-foreground">{value.toLocaleString()}</div>
    </Card>
  );
}

export default async function AdminPage() {
  if (!(await isAdminRequest())) notFound();

  const metrics = await getAdminMetrics();
  const proShare = metrics.totalUsers
    ? Math.round((metrics.proUsers / metrics.totalUsers) * 100)
    : 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Platform metrics and course engagement.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={metrics.totalUsers} icon={Users} accent="text-primary" />
        <StatCard label="Free users" value={metrics.freeUsers} icon={UserCheck} accent="text-success" />
        <StatCard label={`Pro users (${proShare}%)`} value={metrics.proUsers} icon={Crown} accent="text-secondary" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Active learners per course</h2>
        <Card className="mt-3 p-5">
          <AdminCourseChart
            data={metrics.courseStats.map((course) => ({
              title: course.title,
              activeLearners: course.activeLearners,
              isPremium: course.isPremium,
            }))}
          />
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Course breakdown</h2>
        <Card className="mt-3 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Domain</th>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">Enrolled</th>
                <th className="px-5 py-3">Active</th>
                <th className="px-5 py-3">Lessons</th>
                <th className="px-5 py-3">Completion</th>
              </tr>
            </thead>
            <tbody>
              {metrics.courseStats.map((course) => (
                <tr key={course.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{course.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{course.domain}</td>
                  <td className="px-5 py-3">
                    <Badge variant={course.isPremium ? "secondary" : "success"}>
                      {course.isPremium ? "Pro" : "Free"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">{course.enrollments}</td>
                  <td className="px-5 py-3">{course.activeLearners}</td>
                  <td className="px-5 py-3">{course.lessonCount}</td>
                  <td className="px-5 py-3">{course.completionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Recent signups</h2>
        <Card className="mt-3 divide-y divide-border/60 p-0">
          {metrics.recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <div className="font-medium text-foreground">{user.name ?? "Anonymous"}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={user.subscriptionTier === "PRO" ? "secondary" : "muted"}>
                  {user.subscriptionTier}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {user.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </main>
  );
}
