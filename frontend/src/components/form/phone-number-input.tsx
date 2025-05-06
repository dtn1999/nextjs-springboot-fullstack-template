"use client";

import type React from "react";
import { forwardRef } from "react";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Control, FieldError, FieldValues, Path } from "react-hook-form";
import "react-phone-number-input/style.css";

// Create a custom input component that wraps shadcn's Input
const CustomInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <Input
      className={cn(
        "flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
CustomInput.displayName = "CustomInput";

interface PhoneInputProps<TFieldValues extends FieldValues> {
  label?: string;
  error?: FieldError;
  className?: string;
  control?: Control<TFieldValues>;
  name: Path<TFieldValues>;
  id?: string;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export function PhoneNumberInput<TFieldValues extends FieldValues>({
  label,
  error,
  className,
  name,
  control,
  id = "phone",
  description,
  disabled,
  placeholder,
  required,
  ...props
}: PhoneInputProps<TFieldValues>) {
  // Generate unique IDs for accessibility
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // Get error message
  const errorMessage = error?.message;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div
        className={cn(
          "phone-input-wrapper flex rounded-md border border-input bg-background transition-colors",
          "h-9 rounded-full px-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          errorMessage && "border-destructive focus-within:ring-destructive",
          disabled && "cursor-not-allowed opacity-50"
        )}
        aria-invalid={!!errorMessage}
        aria-describedby={cn(descriptionId, errorId)}
      >
        <PhoneInputWithCountry
          name={name}
          control={control}
          international
          countryCallingCodeEditable={false}
          defaultCountry="US"
          inputComponent={CustomInput}
          className="flex w-full"
          smartCaret={false}
          disabled={disabled}
          placeholder={placeholder}
          id={id}
          aria-describedby={cn(descriptionId, errorId)}
          aria-invalid={!!errorMessage}
        />
      </div>
      {description && !errorMessage && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {errorMessage && (
        <p id={errorId} className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
