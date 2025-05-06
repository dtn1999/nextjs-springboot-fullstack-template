import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { HTMLAttributes } from "react";

interface UploadZoneProps extends HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  className?: string;
}

export function UploadZone(props: UploadZoneProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative flex w-full flex-col items-center overflow-hidden rounded-lg border-2 border-dashed border-neutral-200 py-12 text-center hover:cursor-pointer"
      )}
    >
      <div className="flex flex-col">
        <svg
          className="mx-auto h-12 w-12 text-neutral-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
      <div className="flex text-sm text-neutral-600 dark:text-neutral-300">
        <span className="text-brand-500">Upload a file</span>
        <p className="ps-1">or drag and drop</p>
      </div>
      {props.loading ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
          <Loader />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
