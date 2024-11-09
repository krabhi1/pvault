"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

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
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <span className={cn("w-full flex", className)}>
      {isEditing ? (
        <Input
          ref={inputRef}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={className}
          value={value}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={cn(
            "flex h-9 w-full  px-3 py-1 text-sm text-center items-center "
          )}
        >
          {value}
        </div>
      )}
    </span>
  );
}
