"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

// Create a responsive dialog component that renders as a drawer on mobile
const ResponsiveDialog = ({
  children,
  open,
  onOpenChange,
  ...props
}: DialogPrimitive.DialogProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
    );
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </DialogPrimitive.Root>
  );
};

const ResponsiveDialogTrigger = DialogPrimitive.Trigger;

const ResponsiveDialogClose = DialogPrimitive.Close;

const ResponsiveDialogPortal = ({
  children,
  container,
  forceMount,
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal
    children={children}
    container={container}
    forceMount={forceMount}
  />
);
ResponsiveDialogPortal.displayName = DialogPrimitive.Portal.displayName;

const ResponsiveDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
ResponsiveDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ResponsiveDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return <DrawerContent className={className}>{children}</DrawerContent>;
  }

  return (
    <ResponsiveDialogPortal>
      <ResponsiveDialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 px-6 py-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[500px] sm:rounded-3xl md:w-full",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute left-2 top-2 flex size-8 items-center justify-center rounded-full opacity-70 ring-offset-background transition-opacity hover:bg-gray-100 hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </ResponsiveDialogPortal>
  );
});
ResponsiveDialogContent.displayName = DialogPrimitive.Content.displayName;

const ResponsiveDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return <DrawerHeader className={className} {...props} />;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-1.5 border-b-[1px] border-b-gray-50 py-6 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
};
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

const ResponsiveDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return <DrawerFooter className={className} {...props} />;
  }

  return (
    <div
      className={cn(
        "flex flex-col-reverse items-center border-t-[1px] border-t-gray-50 py-4 sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  );
};
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

const ResponsiveDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return <DrawerTitle className={className} {...props} />;
  }

  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
});
ResponsiveDialogTitle.displayName = DialogPrimitive.Title.displayName;

const ResponsiveDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return <DrawerDescription className={className} {...props} />;
  }

  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
ResponsiveDialogDescription.displayName =
  DialogPrimitive.Description.displayName;

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogClose,
};
