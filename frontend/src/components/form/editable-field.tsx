"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";

export interface SettingInputProps {
  label: string;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
  placeholder: string;
  onEditorOpen?: () => void;
  onEditorClose?: () => void;
  noValueActionLabel: string;
  valueActionLabel?: string;
  className?: string;
  renderSettingEditor?: (afterSubmitCallback: () => void) => ReactNode;
  id?: string;
}

export function EditableField(props: SettingInputProps) {
  const {
    label,
    value,
    disabled,
    placeholder,
    valueActionLabel,
    noValueActionLabel,
    renderSettingEditor,
    onEditorClose,
    onEditorOpen,
    className,
  } = props;

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const toggleEditor = () => {
    const newState = !isEditorOpen;
    setIsEditorOpen(newState);

    if (newState) {
      onEditorOpen?.();
    } else {
      onEditorClose?.();
    }
  };

  const closeEditor = () => setIsEditorOpen(false);

  const buttonLabel = () => {
    if (!isEditorOpen) {
      return value ? valueActionLabel : noValueActionLabel;
    }
    return "Cancel";
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-[720px] flex-col border-b border-neutral-200 py-6",
        className
      )}
    >
      <div
        className={cn("flex w-full flex-col", {
          "pointer-events-none": disabled,
        })}
      >
        <div className="flex w-full justify-between">
          <h3
            className={cn(
              "text-lg font-semibold text-gray-800 dark:text-neutral-100",
              { "text-gray-200": disabled }
            )}
          >
            {label}
          </h3>
          <Button
            variant="link"
            onClick={toggleEditor}
            disabled={disabled}
            className={cn(
              "text-sm font-semibold text-accent-400 underline hover:underline",
              {
                "text-gray-200": disabled,
              }
            )}
          >
            {buttonLabel()}
          </Button>
        </div>

        {!isEditorOpen && (
          <p
            className={cn(
              "mt-1 text-sm text-neutral-500 dark:text-neutral-400",
              {
                "text-body": disabled,
              }
            )}
          >
            {value ?? placeholder}
          </p>
        )}
      </div>

      <div
        className={cn(
          "max-h-0 overflow-hidden transition-all duration-700 ease-in-out",
          {
            "max-h-fit": isEditorOpen,
          }
        )}
      >
        {renderSettingEditor?.(closeEditor)}
      </div>
    </div>
  );
}
