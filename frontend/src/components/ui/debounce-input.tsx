"use client";

import { useEffect, useState } from "react";
import { Input } from "./input";

export interface DebounceInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onChange?: (value?: string) => void;
  debounce?: number;
}

export function DebouncedInput(props: DebounceInputProps) {
  const { value: initialValue, onChange, debounce = 500, ...rest } = props;

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <Input {...rest} value={value} onChange={(e) => setValue(e.target.value)} />
  );
}
