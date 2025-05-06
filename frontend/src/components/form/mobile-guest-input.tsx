"use client";
import React, { useEffect, useState } from "react";
import { InputNumber } from "./input-number";

export interface Props {
  defaultValue?: number | null;
  onChange?: (value: number) => void;
  className?: string;
}

export function MobileGuestsInput(props: Props) {
  const { defaultValue, onChange, className = "" } = props;

  const [totalGuests, setTotalGuests] = useState(defaultValue || 0);

  useEffect(() => {
    setTotalGuests(defaultValue || 0);
  }, [defaultValue]);

  const handleChangeData = (value: number) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`relative flex flex-col p-5 ${className}`}>
      <span className="mb-5 block text-xl font-semibold sm:text-2xl">
        {"Who's coming?"}
      </span>
      <InputNumber
        className="w-full"
        defaultValue={totalGuests}
        onChange={handleChangeData}
        max={20}
        label={"Guests"}
        desc={""}
      />
    </div>
  );
}
