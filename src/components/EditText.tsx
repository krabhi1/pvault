"use client";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export type EditTextProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isSecret?: boolean;
  isMultiline?: boolean;
  className?: string;
};
export default function ({
  className,
  value,
  onChange,
  placeholder,
  isSecret,
  isMultiline,
}: EditTextProps) {
  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={className}
      value={value}
    />
  );
}
