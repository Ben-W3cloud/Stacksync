import { prisma } from "@/lib/prisma";

export type CourseCertificate = {
  courseSlug: string;
  courseTitle: string;
  domain: string;
  totalLessons: number;
  completedLessons: number;
  earned: boolean;
  completedAt: Date | null;
};

export async function getUserCertificates(userId: string): Promise<CourseCertificate[]> {
  const courses = await prisma.course.findMany({
    orderBy: [{ domain: { name: "asc" } }, { order: "asc" }],
    include: {
      domain: { select: { name: true } },
      modules: {
        include: {
          lessons: {
            include: { progress: { where: { userId } } },
          },
        },
      },
    },
  });

  return courses.map((course) => {
    const lessons = course.modules.flatMap((module) => module.lessons);
    const completions = lessons
      .map((lesson) => lesson.progress[0]?.completedAt ?? null)
      .filter((date): date is Date => Boolean(date));

    const earned = lessons.length > 0 && completions.length === lessons.length;
    const completedAt = earned
      ? completions.reduce((latest, date) => (date > latest ? date : latest), completions[0])
      : null;

    return {
      courseSlug: course.slug,
      courseTitle: course.title,
      domain: course.domain.name,
      totalLessons: lessons.length,
      completedLessons: completions.length,
      earned,
      completedAt,
    };
  });
}

export async function getCourseCertificate(
  userId: string,
  courseSlug: string,
): Promise<CourseCertificate | null> {
  const all = await getUserCertificates(userId);
  return all.find((certificate) => certificate.courseSlug === courseSlug) ?? null;
}
