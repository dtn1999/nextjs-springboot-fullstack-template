"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon as XMarkIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import useGoBack from "@/hooks/use-go-back";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border border-neutral-200 bg-white font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800",
        third:
          "border border-neutral-200 text-neutral-700 dark:text-neutral-200 dark:border-neutral-700",
        primary:
          "bg-brand-600 text-neutral-50 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        close:
          "flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700",
        circle:
          "bg-brand-600 flex items-center justify-center rounded-full !leading-none text-neutral-50 hover:bg-brand-700 disabled:bg-opacity-70",
      },
      size: {
        default: "h-10 px-4 py-3",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
        circle: "w-9 h-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  href?: string;
  targetBlank?: boolean;
  fontSize?: string;
  sizeClass?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      href,
      targetBlank,
      translate = "",
      fontSize = "text-sm font-medium",
      sizeClass,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const renderLoading = () => {
      return (
        <svg
          className="-ms-1 me-3 h-5 w-5 animate-spin"
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
    };

    // If variant is close, render the close button
    if (variant === "close") {
      return (
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-5 w-5" />
        </button>
      );
    }

    // If href is provided, render as a link
    if (href) {
      return (
        <Link
          href={href}
          target={targetBlank ? "_blank" : undefined}
          className={cn(
            buttonVariants({ variant, size, className }),
            translate,
            fontSize,
            sizeClass
          )}
          rel={targetBlank ? "noopener noreferrer" : undefined}
          onClick={props.onClick as any}
        >
          {children || `This is Link`}
        </Link>
      );
    }

    // Otherwise render as a button
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          translate,
          fontSize,
          sizeClass
        )}
        ref={ref}
        disabled={props.disabled || loading}
        type={props.type ?? "button"}
        {...props}
      >
        {loading && renderLoading()}
        {children || `This is Button`}
      </Comp>
    );
  }
);

Button.displayName = "Button";

function GoBackButton({ className }: Readonly<{ className?: string }>) {
  const goBack = useGoBack();
  return (
    <button
      onClick={goBack}
      className={cn(
        "flex size-13 items-center justify-center rounded-full border border-border bg-gray-100/50 p-0",
        className
      )}
    >
      <ArrowLeftIcon className="size-5" />
    </button>
  );
}

export interface ClearDataButtonProps {
  onClick: () => void;
}

function ClearDataButton({ onClick }: Readonly<ClearDataButtonProps>) {
  return (
    <span
      onClick={() => onClick?.()}
      className="absolute end-1 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 transform items-center justify-center rounded-full bg-neutral-100 text-sm dark:bg-neutral-800 lg:end-3 lg:h-6 lg:w-6"
    >
      <XMarkIcon className="h-4 w-4" />
    </span>
  );
}

export { Button, GoBackButton, ClearDataButton, buttonVariants };
