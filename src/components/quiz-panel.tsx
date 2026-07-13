"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, Coins, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuizOption = { id: string; value: string };
type QuizQuestion = { id: string; prompt: string; options: QuizOption[] };
type Quiz = { id: string; passingScore: number; questions: QuizQuestion[] };

type QuestionResult = {
  questionId: string;
  correctOptionId: string | null;
  chosenOptionId: string | null;
  correct: boolean;
};

type SubmitResponse = {
  isPass: boolean;
  score: number;
  correctCount: number;
  totalQuestions: number;
  results: QuestionResult[];
};

export function QuizPanel({ lessonId, quiz }: { lessonId: string; quiz: Quiz | null }) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  if (!quiz) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">No quiz for this lesson yet.</Card>
    );
  }

  const allAnswered = quiz.questions.every((question) => selections[question.id]);

  async function submit() {
    setStatus("submitting");
    const response = await fetch(`/api/lessons/${lessonId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: Object.entries(selections).map(([questionId, optionId]) => ({
          questionId,
          optionId,
        })),
      }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const data = (await response.json()) as SubmitResponse;
    setResult(data);
    setStatus("idle");

    if (data.isPass) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#a78bfa", "#facc15", "#10b981"],
      });
    }
  }

  return (
    <Card className="p-5">
      <h3 className="font-bold text-foreground">Lesson Quiz</h3>
      <p className="mt-1 text-sm text-muted-foreground">Passing score: {quiz.passingScore}%</p>

      <div className="mt-4 space-y-5">
        {quiz.questions.map((question, index) => {
          const questionResult = result?.results.find((r) => r.questionId === question.id);
          const wrongShake = questionResult && !questionResult.correct;

          return (
            <fieldset key={question.id}>
              <legend className="text-sm font-semibold text-foreground">
                {index + 1}. {question.prompt}
              </legend>
              <motion.div
                animate={wrongShake ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
                transition={{ duration: 0.4 }}
                className="mt-2 space-y-2"
              >
                {question.options.map((option) => {
                  const isSelected = selections[question.id] === option.id;
                  let stateClass = "border-border hover:border-primary/50";
                  let icon: React.ReactNode = null;

                  if (questionResult) {
                    if (option.id === questionResult.correctOptionId) {
                      stateClass = "border-success bg-success/10 text-success";
                      icon = <Check className="h-4 w-4" />;
                    } else if (option.id === questionResult.chosenOptionId) {
                      stateClass = "border-danger bg-danger/10 text-danger";
                      icon = <X className="h-4 w-4" />;
                    }
                  } else if (isSelected) {
                    stateClass = "border-primary bg-primary/10";
                  }

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-2xl border-2 px-4 py-2.5 text-sm font-medium transition",
                        stateClass,
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={isSelected}
                          disabled={Boolean(result)}
                          onChange={() =>
                            setSelections((prev) => ({ ...prev, [question.id]: option.id }))
                          }
                          className="accent-primary"
                        />
                        {option.value}
                      </span>
                      {icon}
                    </label>
                  );
                })}
              </motion.div>
            </fieldset>
          );
        })}
      </div>

      {!result ? (
        <Button
          onClick={submit}
          disabled={!allAnswered || status === "submitting"}
          className="mt-5 w-full"
        >
          {status === "submitting" ? "Submitting..." : "Submit Quiz"}
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-5"
          >
            {result.isPass ? (
              <div className="flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-sm font-semibold text-success">
                <Coins className="h-4 w-4" />
                Passed with {result.score}% ({result.correctCount}/{result.totalQuestions}). +25
                coins, +50 XP.
              </div>
            ) : (
              <div className="space-y-3">
                <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
                  Scored {result.score}% ({result.correctCount}/{result.totalQuestions}). Review
                  and retry.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setSelections({});
                  }}
                >
                  Try Again
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {status === "error" ? (
        <p className="mt-3 text-sm text-danger">Submission failed. Make sure you are signed in.</p>
      ) : null}
    </Card>
  );
}
