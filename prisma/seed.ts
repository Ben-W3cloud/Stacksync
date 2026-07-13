import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "learner@stacksync.dev" },
    update: {},
    create: {
      email: "learner@stacksync.dev",
      name: "StackSync Learner",
      passwordHash,
    },
  });

  const course = await prisma.course.findUnique({ where: { slug: "stacksync-core" } });
  if (!course) {
    console.warn(
      'Course "stacksync-core" not found — run "npm run content:sync" before seeding.',
    );
    return;
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    update: {},
    create: { userId: user.id, courseId: course.id },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
