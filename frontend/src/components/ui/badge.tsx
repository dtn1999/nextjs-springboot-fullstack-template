import type * as React from "react";
import { ClipboardEventHandler } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type BadgeColor =
  | "pink"
  | "red"
  | "gray"
  | "green"
  | "purple"
  | "indigo"
  | "yellow"
  | "blue";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        unstyle: "",
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Color variants are handled separately with the getColorClass function
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "unstyle",
      rounded: "full",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof badgeVariants>, "variant"> {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  color?: BadgeColor;
  href?: string;
  name?: React.ReactNode;
  targetBlank?: boolean;
}

function Badge({
  className,
  variant,
  color,
  rounded,
  size,
  href,
  name,
  targetBlank,
  children,
  ...props
}: BadgeProps) {
  const content = name || children;

  // Function to get color classes based on the color prop
  const getColorClass = (hasHover = true) => {
    if (!color) return "";

    switch (color) {
      case "pink":
        return `border-transparent text-pink-800 bg-pink-100 ${hasHover ? "hover:bg-pink-800 hover:text-white" : ""}`;
      case "red":
        return `border-transparent text-red-800 bg-red-100 ${hasHover ? "hover:bg-red-800 hover:text-white" : ""}`;
      case "gray":
        return `border-transparent text-gray-800 bg-gray-100 ${hasHover ? "hover:bg-gray-800 hover:text-white" : ""}`;
      case "green":
        return `border-transparent text-green-800 bg-green-100 ${hasHover ? "hover:bg-green-800 hover:text-white" : ""}`;
      case "purple":
        return `border-transparent text-purple-800 bg-purple-100 ${
          hasHover ? "hover:bg-purple-800 hover:text-white" : ""
        }`;
      case "indigo":
        return `border-transparent text-indigo-800 bg-indigo-100 ${
          hasHover ? "hover:bg-indigo-800 hover:text-white" : ""
        }`;
      case "yellow":
        return `border-transparent text-yellow-800 bg-yellow-100 ${
          hasHover ? "hover:bg-yellow-800 hover:text-white" : ""
        }`;
      case "blue":
        return `border-transparent text-blue-800 bg-blue-100 ${hasHover ? "hover:bg-blue-800 hover:text-white" : ""}`;
      default:
        return "";
    }
  };

  // Determine the final className
  const badgeClassName = cn(
    badgeVariants({ rounded, size }),
    color ? getColorClass(!!href) : variant && badgeVariants({ variant }),
    className
  );

  // Render as link if href is provided
  if (href) {
    return (
      <Link
        href={href}
        className={badgeClassName}
        target={targetBlank ? "_blank" : undefined}
        rel={targetBlank ? "noopener noreferrer" : undefined}
        {...(props as ClipboardEventHandler<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  // Otherwise render as a div
  return (
    <div className={badgeClassName} {...props}>
      {content}
    </div>
  );
}

export { Badge, badgeVariants };
