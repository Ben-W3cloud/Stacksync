import type { ReactNode } from "react";
import { QuizPanel } from "@/components/quiz-panel";
import { Card } from "@/components/ui/card";

type Resource = {
  title: string;
  url: string;
};

type QuizOption = { id: string; value: string };
type QuizQuestion = { id: string; prompt: string; options: QuizOption[] };
type Quiz = { id: string; passingScore: number; questions: QuizQuestion[] };

export function LessonViewer({
  lessonId,
  lessonTitle,
  content,
  resources,
  quiz,
}: {
  lessonId: string;
  lessonTitle: string;
  content: ReactNode;
  resources: Resource[];
  quiz: Quiz | null;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h1 className="text-2xl font-extrabold text-foreground">{lessonTitle}</h1>
        <div className="mt-4 space-y-4 text-foreground/80 [&_a]:text-primary [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-muted [&_pre]:p-3">
          {content}
        </div>
        {resources.length ? (
          <div className="mt-6 space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Resources
            </h2>
            {resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="block text-primary hover:underline"
              >
                {resource.title}
              </a>
            ))}
          </div>
        ) : null}
      </Card>
      <QuizPanel lessonId={lessonId} quiz={quiz} />
    </div>
  );
}
