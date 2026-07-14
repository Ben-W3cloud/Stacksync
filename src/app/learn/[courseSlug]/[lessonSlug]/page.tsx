import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { LessonViewer } from "@/components/lesson-viewer";
import { Paywall } from "@/components/paywall";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const lesson = await prisma.lesson.findFirst({
    where: { slug: lessonSlug, module: { course: { slug: courseSlug } } },
    select: { title: true, contentMdx: true, module: { select: { course: { select: { title: true } } } } },
  });

  if (!lesson) return { title: "Lesson not found — StackSync" };

  const description = lesson.contentMdx
    .replace(/[#>*`_\-\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
  const title = `${lesson.title} — ${lesson.module.course.title} — StackSync`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const session = await getServerSession(authOptions);

  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      module: { course: { slug: courseSlug } },
    },
    include: {
      resources: true,
      module: { include: { course: true } },
      quiz: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { options: { select: { id: true, value: true } } },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  if (lesson.module.course.isPremium) {
    const user = session?.user?.id
      ? await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { subscriptionTier: true },
        })
      : null;

    if (user?.subscriptionTier !== "PRO") {
      return (
        <main className="mx-auto min-h-screen w-full max-w-2xl px-6 py-10">
          <Paywall lessonTitle={lesson.title} courseTitle={lesson.module.course.title} />
        </main>
      );
    }
  }

  const quiz = lesson.quiz
    ? {
        id: lesson.quiz.id,
        passingScore: lesson.quiz.passingScore,
        questions: lesson.quiz.questions,
      }
    : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <LessonViewer
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        content={<MDXRemote source={lesson.contentMdx} />}
        resources={lesson.resources}
        quiz={quiz}
      />
    </main>
  );
}
