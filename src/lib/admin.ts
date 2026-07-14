import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Admin gate. Primary check is the User.role column. ADMIN_EMAIL is kept as a
 * bootstrap: the matching account is treated as admin (and auto-promoted on
 * access) so the first admin can be created without hand-editing the database.
 */
export async function isAdminRequest(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, email: true },
  });
  if (!user) return false;

  if (user.role === "ADMIN") return true;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email.toLowerCase() === adminEmail.toLowerCase()) {
    await prisma.user.update({ where: { id: session.user.id }, data: { role: "ADMIN" } });
    return true;
  }

  return false;
}

export async function getAdminMetrics() {
  const [totalUsers, proUsers, courses, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { subscriptionTier: "PRO" } }),
    prisma.course.findMany({
      orderBy: [{ order: "asc" }],
      include: {
        domain: { select: { name: true } },
        _count: { select: { enrollments: true } },
        modules: {
          include: {
            lessons: {
              include: {
                _count: { select: { progress: true } },
                progress: { select: { userId: true, completedAt: true } },
              },
            },
          },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptionTier: true,
      },
    }),
  ]);

  const courseStats = courses.map((course) => {
    const lessons = course.modules.flatMap((module) => module.lessons);
    const learnerIds = new Set<string>();
    let completions = 0;

    for (const lesson of lessons) {
      for (const progress of lesson.progress) {
        learnerIds.add(progress.userId);
        if (progress.completedAt) completions++;
      }
    }

    const lessonCount = lessons.length;
    const totalPossible = lessonCount * learnerIds.size;
    const completionRate = totalPossible ? Math.round((completions / totalPossible) * 100) : 0;

    return {
      id: course.id,
      title: course.title,
      domain: course.domain.name,
      isPremium: course.isPremium,
      enrollments: course._count.enrollments,
      activeLearners: learnerIds.size,
      lessonCount,
      completions,
      completionRate,
    };
  });

  return {
    totalUsers,
    proUsers,
    freeUsers: totalUsers - proUsers,
    courseStats,
    recentUsers,
  };
}

export type AdminMetrics = Awaited<ReturnType<typeof getAdminMetrics>>;
