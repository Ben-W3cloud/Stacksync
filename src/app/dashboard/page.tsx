import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Coins, Flame, Zap } from "lucide-react";
import { SkillWebChart } from "@/components/skill-web-chart";
import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { streak: true, xpTotal: true, coinBalance: true },
  });
  if (!user) redirect("/signin");

  const domains = await prisma.domain.findMany({
    include: {
      courses: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  progress: { where: { userId: session.user.id } },
                },
              },
            },
          },
        },
      },
    },
  });

  const skillData = domains.map((domain) => {
    const lessons = domain.courses.flatMap((course) =>
      course.modules.flatMap((module) => module.lessons),
    );
    const completed = lessons.filter((lesson) => lesson.progress[0]?.completedAt).length;
    const value = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
    return { domain: domain.name, value };
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Profile Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-streak/10 text-streak">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className="text-2xl font-extrabold">{user.streak} days</div>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total XP</div>
            <div className="text-2xl font-extrabold">{user.xpTotal.toLocaleString()}</div>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coin/15 text-yellow-700">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Sync-Coins</div>
            <div className="text-2xl font-extrabold">{user.coinBalance.toLocaleString()}</div>
          </div>
        </Card>
      </div>
      <div className="mt-6">
        <SkillWebChart data={skillData} />
      </div>
    </main>
  );
}
