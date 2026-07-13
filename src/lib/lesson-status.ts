export type LessonStatus = "locked" | "in-progress" | "complete";

export function computeLessonStatuses<T extends { completed: boolean }>(
  lessons: T[],
): LessonStatus[] {
  let previousCompleted = true;
  return lessons.map((lesson) => {
    if (lesson.completed) {
      previousCompleted = true;
      return "complete";
    }
    if (previousCompleted) {
      previousCompleted = false;
      return "in-progress";
    }
    return "locked";
  });
}
