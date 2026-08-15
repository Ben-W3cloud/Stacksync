import { prisma } from "@/lib/prisma";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function utcDayNumber(date: Date): number {
  return Math.floor(date.getTime() / MS_PER_DAY);
}

export class QuizNotFoundError extends Error {
  constructor() {
    super("Quiz not found for lesson");
    this.name = "QuizNotFoundError";
  }
}

export async function submitLessonQuiz({
  userId,
  lessonId,
  answers,
}: {
  userId: string;
  lessonId: string;
  answers: { questionId: string; optionId: string }[];
}) {
  const quiz = await prisma.quiz.findUnique({
    where: { lessonId },
    include: {
      questions: {
        include: { options: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!quiz) throw new QuizNotFoundError();

  const results = quiz.questions.map((question) => {
    const correctOption = question.options.find((option) => option.isCorrect);
    const chosen = answers.find((answer) => answer.questionId === question.id);
    const chosenOption = chosen
      ? question.options.find((option) => option.id === chosen.optionId)
      : undefined;

    return {
      questionId: question.id,
      correctOptionId: correctOption?.id ?? null,
      chosenOptionId: chosenOption?.id ?? null,
      correct: Boolean(chosenOption?.isCorrect),
    };
  });

  const correctCount = results.filter((result) => result.correct).length;
  const score = quiz.questions.length
    ? Math.round((correctCount / quiz.questions.length) * 100)
    : 0;
  const isPass = score >= quiz.passingScore;

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  const alreadyCompleted = Boolean(existing?.completedAt);

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      quizScore: score,
      completedAt: isPass ? (existing?.completedAt ?? new Date()) : existing?.completedAt ?? null,
    },
    create: {
      userId,
      lessonId,
      quizScore: score,
      completedAt: isPass ? new Date() : null,
    },
  });

  if (isPass && !alreadyCompleted) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const now = new Date();
    const todayNumber = utcDayNumber(now);
    const lastActivityNumber = user.lastActivityAt ? utcDayNumber(user.lastActivityAt) : null;

    let nextStreak = user.streak;
    if (lastActivityNumber === null || lastActivityNumber === todayNumber - 1) {
      nextStreak = user.streak + 1;
    } else if (lastActivityNumber !== todayNumber) {
      nextStreak = 1;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        coinBalance: { increment: 25 },
        xpTotal: { increment: 50 },
        streak: nextStreak,
        lastActivityAt: now,
      },
    });
  }

  return { progress, isPass, score, correctCount, totalQuestions: quiz.questions.length, results };
}
