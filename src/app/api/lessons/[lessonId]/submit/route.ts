import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { QuizNotFoundError, submitLessonQuiz } from "@/server/progress-service";

const payloadSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        optionId: z.string().min(1),
      }),
    )
    .min(1),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ lessonId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { lessonId } = await context.params;

  try {
    const result = await submitLessonQuiz({
      userId: session.user.id,
      lessonId,
      answers: parsed.data.answers,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof QuizNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    throw error;
  }
}
