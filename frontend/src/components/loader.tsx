"use client";

import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store";
import { useEffect } from "react";

export function LoadingScreen() {
  const { loading } = useGlobalStore();

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  if (!loading) {
    return null;
  }

  return (
    <div className="absolute inset-x-0 top-0 z-99 flex h-screen items-center justify-center bg-white/50">
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    </div>
  );
}

export function Loader({
  className = "text-brand-500",
}: {
  className?: string;
}) {
  return (
    <svg
      className={cn("-ml-1 mr-3 h-5 w-5 animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
