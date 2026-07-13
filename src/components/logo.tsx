import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center justify-center overflow-hidden rounded-xl bg-zinc-950 p-1", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo-mark.png"
        alt="StackSync"
        width={size * 4}
        height={size * 4}
        className="h-full w-full object-contain"
        priority
      />
    </span>
  );
}
