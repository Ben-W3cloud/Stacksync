import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PrismaClient } from "@prisma/client";
import {
  courseMetaSchema,
  domainMetaSchema,
  lessonFrontmatterSchema,
  moduleMetaSchema,
} from "../src/lib/content-schema";

const prisma = new PrismaClient();
const CONTENT_ROOT = path.join(__dirname, "..", "content");

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function dirsOnly(parent: string): string[] {
  return fs
    .readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

async function syncLesson(moduleId: string, moduleDir: string, lessonSlug: string) {
  const filePath = path.join(moduleDir, `${lessonSlug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const parsed = lessonFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${filePath}: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    );
  }
  const { title, order, quiz, resources } = parsed.data;

  const lesson = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId, slug: lessonSlug } },
    update: { title, order, contentMdx: content.trim() },
    create: { moduleId, slug: lessonSlug, title, order, contentMdx: content.trim() },
  });

  if (quiz) {
    const quizRecord = await prisma.quiz.upsert({
      where: { lessonId: lesson.id },
      update: { passingScore: quiz.passingScore },
      create: { lessonId: lesson.id, passingScore: quiz.passingScore },
    });

    await prisma.quizQuestion.deleteMany({ where: { quizId: quizRecord.id } });
    for (const question of quiz.questions) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quizRecord.id,
          prompt: question.prompt,
          order: question.order,
          options: {
            create: question.options.map((option) => ({
              value: option.value,
              isCorrect: option.correct,
            })),
          },
        },
      });
    }
  } else {
    await prisma.quiz.deleteMany({ where: { lessonId: lesson.id } });
  }

  await prisma.externalResource.deleteMany({ where: { lessonId: lesson.id } });
  if (resources?.length) {
    await prisma.externalResource.createMany({
      data: resources.map((resource) => ({
        lessonId: lesson.id,
        title: resource.title,
        url: resource.url,
        type: resource.type,
      })),
    });
  }

  console.log(`  lesson synced: ${lessonSlug}`);
}

async function syncModule(courseId: string, courseDir: string, moduleSlug: string) {
  const moduleDir = path.join(courseDir, moduleSlug);
  const meta = moduleMetaSchema.parse(readJson(path.join(moduleDir, "module.json")));

  const moduleRecord = await prisma.module.upsert({
    where: { courseId_slug: { courseId, slug: moduleSlug } },
    update: { title: meta.title, order: meta.order },
    create: { courseId, slug: moduleSlug, title: meta.title, order: meta.order },
  });

  console.log(` module synced: ${moduleSlug}`);

  const lessonFiles = fs
    .readdirSync(moduleDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  for (const lessonSlug of lessonFiles) {
    await syncLesson(moduleRecord.id, moduleDir, lessonSlug);
  }
}

async function syncCourse(domainId: string, domainDir: string, courseSlug: string) {
  const courseDir = path.join(domainDir, courseSlug);
  const meta = courseMetaSchema.parse(readJson(path.join(courseDir, "course.json")));

  const course = await prisma.course.upsert({
    where: { slug: courseSlug },
    update: {
      title: meta.title,
      description: meta.description,
      order: meta.order,
      isPremium: meta.isPremium,
      domainId,
    },
    create: {
      slug: courseSlug,
      title: meta.title,
      description: meta.description,
      order: meta.order,
      isPremium: meta.isPremium,
      domainId,
    },
  });

  console.log(`course synced: ${courseSlug}`);

  for (const moduleSlug of dirsOnly(courseDir)) {
    await syncModule(course.id, courseDir, moduleSlug);
  }
}

async function syncDomain(domainSlug: string) {
  const domainDir = path.join(CONTENT_ROOT, domainSlug);
  const meta = domainMetaSchema.parse(readJson(path.join(domainDir, "domain.json")));

  const domain = await prisma.domain.upsert({
    where: { slug: domainSlug },
    update: { name: meta.name },
    create: { slug: domainSlug, name: meta.name },
  });

  console.log(`domain synced: ${domainSlug}`);

  for (const courseSlug of dirsOnly(domainDir)) {
    await syncCourse(domain.id, domainDir, courseSlug);
  }
}

async function main() {
  if (!fs.existsSync(CONTENT_ROOT)) {
    throw new Error(`Content directory not found at ${CONTENT_ROOT}`);
  }

  for (const domainSlug of dirsOnly(CONTENT_ROOT)) {
    await syncDomain(domainSlug);
  }
}

main()
  .then(async () => {
    console.log("Content sync complete.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
