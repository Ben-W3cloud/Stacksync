import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Hud } from "@/components/hud";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "StackSync",
    template: "%s",
  },
  description: "Web2 + Web3 learning platform with gamified progression.",
  openGraph: {
    siteName: "StackSync",
    type: "website",
    title: "StackSync",
    description: "Web2 + Web3 learning platform with gamified progression.",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackSync",
    description: "Web2 + Web3 learning platform with gamified progression.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <Hud />
          {children}
        </Providers>
      </body>
    </html>
  );
}
