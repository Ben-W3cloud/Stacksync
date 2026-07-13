import { z } from "zod";

export const domainMetaSchema = z.object({
  name: z.string().min(1),
});

export const courseMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().min(1),
  isPremium: z.boolean().default(false),
});

export const moduleMetaSchema = z.object({
  title: z.string().min(1),
  order: z.number().int().min(1),
});

export const resourceTypeSchema = z.enum(["YOUTUBE", "GITHUB", "DOCS"]);

export const lessonFrontmatterSchema = z.object({
  title: z.string().min(1),
  order: z.number().int().min(1),
  quiz: z
    .object({
      passingScore: z.number().int().min(0).max(100).default(70),
      questions: z
        .array(
          z.object({
            prompt: z.string().min(1),
            order: z.number().int().min(1),
            options: z
              .array(
                z.object({
                  value: z.string().min(1),
                  correct: z.boolean().default(false),
                }),
              )
              .min(2),
          }),
        )
        .min(1)
        .refine((questions) => questions.every((q) => q.options.some((o) => o.correct)), {
          message: "Every question must have at least one correct option",
        }),
    })
    .optional(),
  resources: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().url(),
        type: resourceTypeSchema,
      }),
    )
    .optional(),
});

export type DomainMeta = z.infer<typeof domainMetaSchema>;
export type CourseMeta = z.infer<typeof courseMetaSchema>;
export type ModuleMeta = z.infer<typeof moduleMetaSchema>;
export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;
