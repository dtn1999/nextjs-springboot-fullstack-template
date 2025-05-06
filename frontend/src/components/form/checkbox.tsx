"use client";

import React from "react";

export interface Props {
  label?: string;
  subLabel?: string;
  className?: string;
  name: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox(props: Props) {
  const {
    subLabel = "",
    label = "",
    name,
    className = "",
    defaultChecked,
    onChange,
  } = props;

  return (
    <div className={`flex items-start text-sm sm:text-base ${className}`}>
      <input
        id={name}
        name={name}
        type="checkbox"
        className="focus:ring-action-brand-500 h-5 w-5 rounded border-neutral-400 bg-white text-brand-500 hover:border-neutral-900 focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-700 dark:checked:bg-brand-500 dark:hover:border-neutral-400 sm:h-6 sm:w-6"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      {label && (
        <label
          htmlFor={name}
          className="ms-2 flex flex-1 flex-col justify-center text-start sm:ms-3.5"
        >
          <span className="text-neutral-900 dark:text-neutral-300">
            {label}
          </span>
          {subLabel && (
            <p className="mt-1 text-sm font-light text-neutral-500 dark:text-neutral-400">
              {subLabel}
            </p>
          )}
        </label>
      )}
    </div>
  );
}
