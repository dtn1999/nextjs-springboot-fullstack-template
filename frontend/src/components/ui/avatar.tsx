"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Color palette for random avatar backgrounds
const avatarColors = [
  "#ffdd00",
  "#fbb034",
  "#ff4c4c",
  "#c1d82f",
  "#f48924",
  "#7ac143",
  "#30c39e",
  "#06BCAE",
  "#0695BC",
  "#037ef3",
  "#146eb4",
  "#8e43e7",
  "#ea1d5d",
  "#fc636b",
  "#ff6319",
  "#e01f3d",
  "#a0ac48",
  "#00d1b2",
  "#472f92",
  "#388ed1",
  "#a6192e",
  "#4a8594",
  "#7B9FAB",
  "#1393BD",
  "#5E13BD",
  "#E208A7",
];

// Function to get a consistent color based on a string
const getColorFromString = (str: string) => {
  const firstChar = str.charAt(0).toLowerCase();
  const charCode = firstChar.charCodeAt(0);
  const colorIndex = charCode % avatarColors.length;
  return avatarColors[colorIndex];
};

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  verified?: boolean;
  verifiedClassName?: string;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    {
      className,
      verified,
      verifiedClassName = "w-4 h-4 -top-0.5 -right-0.5",
      ...props
    },
    ref
  ) => (
    <div className="relative inline-flex">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
      {verified && (
        <span
          className={cn(
            "absolute flex items-center justify-center rounded-full bg-teal-500 text-xs text-white",
            verifiedClassName
          )}
        >
          <CheckIcon className="h-3 w-3" />
        </span>
      )}
    </div>
  )
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  name?: string;
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, name, children, style, ...props }, ref) => {
  // Get the text content to determine the background color
  const content = name || children?.toString() || "";
  const bgColor = getColorFromString(content);

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full font-semibold uppercase text-neutral-100",
        className
      )}
      style={{ backgroundColor: bgColor, ...style }}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
