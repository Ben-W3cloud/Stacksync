import { getServerSession } from "next-auth";
import { LearningPath } from "@/components/learning-path";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/lib/auth";
import { computeLessonStatuses } from "@/lib/lesson-status";
import { prisma } from "@/lib/prisma";

export default async function LearnPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const currentUser = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { subscriptionTier: true } })
    : null;
  const isPro = currentUser?.subscriptionTier === "PRO";

  const domains = await prisma.domain.findMany({
    orderBy: { name: "asc" },
    include: {
      courses: {
        orderBy: { order: "asc" },
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
                include: {
                  progress: userId ? { where: { userId } } : false,
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Learning Path</h1>
      <p className="mt-2 text-muted-foreground">Follow your Web2 + Web3 progression roadmap.</p>

      {domains.map((domain) => (
        <section key={domain.id} className="mt-10">
          <h2 className="text-xl font-bold text-primary">{domain.name}</h2>
          {domain.courses.map((course) => {
            const lessons = course.modules.flatMap((module) => module.lessons);
            const statuses = computeLessonStatuses(
              lessons.map((lesson) => ({ completed: Boolean(lesson.progress?.[0]?.completedAt) })),
            );

            return (
              <div key={course.id} className="mt-5 rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {course.title}
                  </h3>
                  {course.isPremium ? (
                    <Badge variant={isPro ? "success" : "secondary"}>
                      {isPro ? "Pro unlocked" : "Pro"}
                    </Badge>
                  ) : (
                    <Badge variant="success">Free</Badge>
                  )}
                </div>
                <div className="mt-4">
                  <LearningPath
                    courseSlug={course.slug}
                    lessons={lessons.map((lesson, index) => ({
                      title: lesson.title,
                      slug: lesson.slug,
                      status: statuses[index],
                    }))}
                  />
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </main>
  );
}
