import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { Award } from "lucide-react";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getCourseCertificate } from "@/lib/certificates";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin");

  const [certificate, user] = await Promise.all([
    getCourseCertificate(session.user.id, courseSlug),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true } }),
  ]);

  if (!certificate || !certificate.earned) notFound();

  const learnerName = user?.name ?? user?.email ?? "StackSync Learner";
  const dateLabel = certificate.completedAt?.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <Logo size={36} />
          <span className="text-lg font-extrabold text-foreground">StackSync</span>
        </div>

        <Award className="mx-auto mt-6 h-12 w-12 text-coin" />
        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Certificate of Completion
        </p>
        <p className="mt-6 text-muted-foreground">This certifies that</p>
        <h1 className="mt-1 text-3xl font-extrabold text-foreground">{learnerName}</h1>
        <p className="mt-4 text-muted-foreground">has successfully completed</p>
        <h2 className="mt-1 text-xl font-bold text-primary">{certificate.courseTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{certificate.domain}</p>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>{certificate.totalLessons} lessons</span>
          {dateLabel ? <span>{dateLabel}</span> : null}
        </div>
      </Card>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Screenshot this page to share your achievement.
      </p>
    </main>
  );
}
