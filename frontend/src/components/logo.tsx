import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo(props: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("relative h-[40px] w-[150px]", props.className)}
    >
      <Image
        className={cn("dark:hidden", props.className)}
        src="/images/logo/logo-icon.svg"
        alt="Logo"
        fill
      />
    </Link>
  );
}
