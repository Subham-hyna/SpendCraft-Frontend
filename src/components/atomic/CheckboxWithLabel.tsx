"use client"

import * as React from "react"
import { Checkbox } from "./checkbox"
import { Label } from "./label"

interface CheckboxWithLabelProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
}

export function CheckboxWithLabel({ checked, onToggle, label, disabled }: CheckboxWithLabelProps) {
  const id = React.useId();
  
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
      <Label
        htmlFor={id}
        className="text-sm sm:text-base font-light text-gray-900 dark:text-gray-100 cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
}

