import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";

export async function Hud() {
  const session = await getServerSession(authOptions);
  const [user, isAdmin] = await Promise.all([
    session?.user?.id
      ? prisma.user.findUnique({
          where: { id: session.user.id },
          select: { streak: true, coinBalance: true, xpTotal: true },
        })
      : null,
    isAdminRequest(),
  ]);

  return <Navbar user={user} isAdmin={isAdmin} />;
}
