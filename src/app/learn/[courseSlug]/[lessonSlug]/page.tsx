import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { LessonViewer } from "@/components/lesson-viewer";
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
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;

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
