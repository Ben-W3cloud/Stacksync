import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Award, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getUserCertificates } from "@/lib/certificates";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin");

  const certificates = await getUserCertificates(session.user.id);

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Certificates</h1>
      <p className="mt-2 text-muted-foreground">Complete every lesson in a course to earn its badge.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {certificates.map((cert) => (
          <Card key={cert.courseSlug} className="p-6">
            <div className="flex items-center justify-between">
              <Award className={cert.earned ? "h-7 w-7 text-coin" : "h-7 w-7 text-muted-foreground"} />
              {cert.earned ? (
                <Badge variant="success">Earned</Badge>
              ) : (
                <Badge variant="muted">
                  {cert.completedLessons}/{cert.totalLessons}
                </Badge>
              )}
            </div>
            <h2 className="mt-3 font-bold text-foreground">{cert.courseTitle}</h2>
            <p className="text-sm text-muted-foreground">{cert.domain}</p>

            {cert.earned ? (
              <Link
                href={`/certificates/${cert.courseSlug}`}
                className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
              >
                View certificate
              </Link>
            ) : (
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Locked
              </span>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}
